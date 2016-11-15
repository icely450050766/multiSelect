/**
 * Created by Administrator on 2016/11/15.
 */
var multiSelect = ( function ($) {
    return{

        $multiSelect: null,

        // 初始化（参数：承载多选下拉列表的元素jq对象，下拉列表的宽度、获取option的url、获取option的data、option的value字段、option的text字段）
        init: function( $parent, width, getOptionURL, getOptionData, optionValue, optionText ){

            this.appendHtml( $parent, width );// 插入html元素, 初始化属性 $multiSelect
            this.getOptions( getOptionURL, getOptionData, optionValue, optionText );// 获取 option 数据

            this.addClickEvent();// 添加点击事件
            this.$multiSelect.find('.multiSelect-options').hide();// 默认 下拉项 隐藏
        },

        // 插入html元素, 初始化属性 $multiSelect
        appendHtml: function( $parent, width ){

            var _str = '<div class="multiSelect">' +
                            '<div class="multiSelect-result"></div>' +
                            '<div class="multiSelect-options"></div>' +
                        '</div>';

            this.$multiSelect = $( _str );
            this.$multiSelect.css( 'width', width );// 设置 多选下拉列表的宽度

            $parent.append( this.$multiSelect );// 插入
        },

        // 获取 option 数据（参数：获取option的url、获取option的data、option的value字段、option的text字段）
        getOptions: function( getOptionURL, getOptionData, optionValue, optionText ){
            var _self = this;

            // 请求数据
            this.postData( getOptionURL, getOptionData, function( data ){
                //console.log( data );
                data = data.data;

                var _content = '';
                for( var i=0; i < data.length; i++ ){
                    _content += '<option value="' + data[i][optionValue] + '">' + data[i][optionText] + '</option>';
                }
                _self.$multiSelect.find('.multiSelect-options').html( _content );// 插入option

            }, function(){
                alertg('获取下拉列表数据失败！')
            });
        },


        // 设置 某个 resultBox样式 （参数：某个 .resultBox 的jq对象）
        setResultBoxStyle: function( $resultBox ){

            var _height = $resultBox.height();

            // 设置 已选择的 resultBox 儿子元素的 高度（垂直居中）
            $resultBox.children().css( 'height', _height + 'px' );

            // 设置 已选择的 resultBox 的 margin （垂直居中）
            //$resultBox.css( 'margin-top', ( $resultBox.parent().height() - _height ) / 2  + 'px' );
        },

        // 添加点击事件
        addClickEvent: function(){

            var _self = this;

            // 收起 下拉列表项（点击空白初收起，:root充满全屏）
            $(document).on('click', ':root', function(e){
                _self.$multiSelect.find('.multiSelect-result').removeClass('focusClass');// 失去 焦点样式
                _self.$multiSelect.find('.multiSelect-options').hide();// 收起下拉列表项
            });

            // 展开 下拉列表项
            _self.$multiSelect.on('click', '.multiSelect-result', function(e){

                // 比 $(document).on 更优先捕捉 点击事件。
                // 如果$(document).on监听 点击删除按钮 事件。点击删除按钮，也是本事件 先被捕捉执行
                e.stopImmediatePropagation();// 不向上传递事件

                $(this).addClass('focusClass');// 得到 焦点样式
                _self.$multiSelect.find('.multiSelect-options').show();// 展开下拉列表项
            });

            // 点击 下拉列表项中 某一项
            _self.$multiSelect.on('click', '.multiSelect-options option', function(e){

                e.stopImmediatePropagation(); // 不向上传递事件

                var $str = $('<div class="resultBox">' +
                                '<div>' +
                                    '<span class="item" value="' + $(this).val() + '">' + $(this).text() + '</span> ' +
                                    '<span class="removeItem">&times;</span> ' +
                                '</div>' +
                            '</div>');

                _self.$multiSelect.find('.multiSelect-result').append( $str );// 选中，添加
                _self.setResultBoxStyle( $str ); // 设置 resultBox样式
                _self.addRemoveItemClickEvent( $('.removeItem', $str) );// 添加 删除按钮 一次性点击事件

                $(this).remove();// 移除 已选择的 下拉项
            });

        },

        // 添加 删除按钮 一次性点击事件（参数：删除按钮jq对象）
        addRemoveItemClickEvent: function( $item ){
            var _self = this;

            $item.one( 'click', function(e){

                e.stopImmediatePropagation(); // 不向上传递事件
                var $item = $(this).prev('.item');

                var $str = $('<option value="' + $item.attr('value') + '">' + $item.text() + '</option>');
                _self.$multiSelect.find('.multiSelect-options').prepend( $str );// 将被移除的项，添加到下拉列表

                $(this).parents('.resultBox').remove();// 移除
            });
        },


        // post请求
        postData: function( url, data, successFunc, errFunc ){
            $.ajax({
                url : url,
                data : data,
                type: 'POST',
                success: function( data ){ if( successFunc ) successFunc(data); },
                error: function( err ){ if( errFunc ) errFunc(err); }
            });
        }
    }
})( jQuery );

