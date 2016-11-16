/**
 * Created by Administrator on 2016/11/15.
 */

// 初始化（参数：承载多选下拉列表的元素jq对象，下拉列表的宽度、获取option的url、获取option的data、option的value字段、option的text字段、是否可输入（模糊搜索））
function MultiSelect( $parent, width, getOptionURL, getOptionData, optionValue, optionText, isInput ) {

    // 是否可输入（true：根据输入 模糊搜索，显示匹配option；false：点击显示所有option）
    this.isInput = ( isInput != undefined ? isInput : false ); // 默认 不可输入
    this. $multiSelect = null;

    this.appendHtml( $parent, width );// 插入html元素, 初始化属性 $multiSelect
    this.getOptions( getOptionURL, getOptionData, optionValue, optionText );// 获取 option 数据

    this.addClickEvent();// 添加点击事件
    this.$multiSelect.find('.multiSelect-options').hide();// 默认 下拉项 隐藏
}

//////////////////////////////////////////////////////////////////////////////////////

// 插入html元素, 初始化属性 $multiSelect
MultiSelect.prototype.appendHtml = function( $parent, width ){

    var _str = '<div class="multiSelect">' +
        '<div class="multiSelect-result" contenteditable="' + ( this.isInput ? 'true' : 'false' ) + '">' +
        '<i class="fa ' + ( this.isInput ?  '' : 'fa-sort-down' ) + '"></i> </div>' + // 向下箭头
        '<div class="multiSelect-options"></div>' +
        '</div>';

    this.$multiSelect = $( _str );
    this.$multiSelect.css( 'width', width );// 设置 多选下拉列表的宽度

    $parent.append( this.$multiSelect );// 插入
};

// 获取 option 数据（参数：获取option的url、获取option的data、option的value字段、option的text字段）
MultiSelect.prototype.getOptions = function( getOptionURL, getOptionData, optionValue, optionText ){
    var _self = this;

    // 请求数据
    this.postData( getOptionURL, getOptionData, function( data ){
        //console.log( data );
        data = data.data;

        var _content = '';
        for( var i=0; i < data.length; i++ ){
            _content += '<option value="' + data[i][optionValue] + '" text="' + data[i][optionText] + '">' + data[i][optionText] + '</option>';
        }
        _self.$multiSelect.find('.multiSelect-options').html( _content );// 插入option

    }, function(){
        alertg('获取下拉列表数据失败！')
    });
};

// 设置 某个 resultBox样式 （参数：某个 .resultBox 的jq对象）
MultiSelect.prototype.setResultBoxStyle = function( $resultBox ){

    var _height = $resultBox.height();

    // 设置 已选择的 resultBox 儿子元素的 高度（垂直居中）
    $resultBox.children().css( 'height', _height + 'px' );

    // 设置 已选择的 resultBox 的 margin （垂直居中）
    //$resultBox.css( 'margin-top', ( $resultBox.parent().height() - _height ) / 2  + 'px' );
};

//////////////////////////////////////////////////////////////////////////////////////

// 添加点击事件
MultiSelect.prototype.addClickEvent = function(){

    var _self = this;

    // 收起 下拉列表项（点击空白初收起，:root充满全屏）
    $(document).on('click', ':root', function(e){
        _self.$multiSelect.find('.multiSelect-result').removeClass('focusClass');// 失去 焦点样式
        _self.$multiSelect.find('.multiSelect-options').hide();// 收起下拉列表项
    });


    // （不可输入）点击 .multiSelect-result，展开 下拉列表项
    _self.$multiSelect.on('click', '.multiSelect-result', function(e){

        // 比 $(document).on 更优先捕捉 点击事件。
        // 如果$(document).on监听 点击删除按钮 事件。点击删除按钮，也是本事件 先被捕捉执行
        e.stopImmediatePropagation();// 不向上传递事件

        $(':root').trigger('click');// 其他多选下拉菜单 失去焦点
        $(this).addClass('focusClass');// 被点击的 得到 焦点样式
        if( !_self.isInput ) _self.$multiSelect.find('.multiSelect-options').show();// 展开下拉列表项
    });

    // （可输入） 模糊搜索，有匹配项，展开 下拉列表项
    _self.$multiSelect.on('keyup', '.multiSelect-result', function(e){

        if( _self.isInput ){ // 可输入 的情况

            var $resultTemp = $(this).clone( false ); //  浅复制节点（不包括事件），避免直接操作 .multiSelect-result
            $resultTemp.children('.resultBox').remove(); // 移除 .resultBox
            var _input = $resultTemp.text();// 获取 用户输入
            //console.log( _input );

            // 默认操作
            _self.$multiSelect.find('.multiSelect-options > option').hide(); // 隐藏 所有选项
            _self.$multiSelect.find('.multiSelect-options').hide();// 收起下拉列表项

            // 查找匹配项 并显示
            var $matchOptions = _self.$multiSelect.find('.multiSelect-options > option[text *= ' + _input + ']');
            $matchOptions.show(); // 显示 匹配选项
            if( $matchOptions.length ) _self.$multiSelect.find('.multiSelect-options').show();// 有匹配项 才展开 下拉列表项

        }
    });


    // 点击 下拉列表项中 某一项
    _self.$multiSelect.on('click', '.multiSelect-options option', function(e){

        e.stopImmediatePropagation(); // 不向上传递事件
        var $multiSelectResult = _self.$multiSelect.find('.multiSelect-result');

        // 可输入（模糊搜索）先清空 用户输入
        if( _self.isInput ){
            var $resultBox = $multiSelectResult.children('.resultBox').clone( true ); // 深复制（包括事件）
            $multiSelectResult.html( $resultBox);
        }

        var $str = $('<div class="resultBox" contenteditable="false">' +
            '<div>' +
            '<span class="item" value="' + $(this).val() + '">' + $(this).text() + '</span> ' +
            '<span class="removeItem">&times;</span> ' +
            '</div>' +
            '</div>');

        $multiSelectResult.append( $str).focus();// 添加 选中项
        _self.setResultBoxStyle( $str ); // 设置 resultBox样式
        _self.editDivFocusEnd( $multiSelectResult );// 可编辑的 div.multiSelect-result，光标定位到最后

        _self.addRemoveItemClickEvent( $('.removeItem', $str) );// 添加 删除按钮 一次性点击事件
        $(this).remove();// 移除 已选择的 下拉项
    });

};

// 添加 删除按钮 一次性点击事件（参数：删除按钮jq对象）
MultiSelect.prototype.addRemoveItemClickEvent = function( $item ){
    var _self = this;

    $item.one( 'click', function(e){
        e.stopImmediatePropagation(); // 不向上传递事件
        var $item = $(this).prev('.item');

        var $str = $('<option value="' + $item.attr('value') + '" text="' + $item.text() + '">' + $item.text() + '</option>');
        _self.$multiSelect.find('.multiSelect-options').prepend( $str );// 将被移除的项，添加到下拉列表

        $(this).parents('.resultBox').remove();// 移除

        // 可编辑的 div.multiSelect-result，光标定位到最后
        var $multiSelectResult = _self.$multiSelect.find('.multiSelect-result');
        _self.editDivFocusEnd( $multiSelectResult );
    });
};

//////////////////////////////////////////////////////////////////////////////////////

// 可编辑的div，光标定位到最后
MultiSelect.prototype.editDivFocusEnd = function( $div ) {

    var domDiv = $div[0];// jq 对象转dom对象
    domDiv.focus();

    if( $.support.msie ) {
        var range = document.selection.createRange();
        this.last = range;
        range.moveToElementText( domDiv );
        range.select();
        document.selection.empty(); //取消选中

    }else {
        var range = document.createRange();
        range.selectNodeContents( domDiv );
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
};

// post请求
MultiSelect.prototype.postData = function( url, data, successFunc, errFunc ){
    $.ajax({
        url : url,
        data : data,
        type: 'POST',
        success: function( data ){ if( successFunc ) successFunc(data); },
        error: function( err ){ if( errFunc ) errFunc(err); }
    });
};

