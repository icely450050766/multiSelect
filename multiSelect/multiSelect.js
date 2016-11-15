/**
 * Created by Administrator on 2016/11/15.
 */
var multiSelect = ( function ($) {
    return{

        $multiSelect: null,

        // ��ʼ�������������ض�ѡ�����б��Ԫ��jq���������б�Ŀ�ȡ���ȡoption��url����ȡoption��data��option��value�ֶΡ�option��text�ֶΣ�
        init: function( $parent, width, getOptionURL, getOptionData, optionValue, optionText ){

            this.appendHtml( $parent, width );// ����htmlԪ��, ��ʼ������ $multiSelect
            this.getOptions( getOptionURL, getOptionData, optionValue, optionText );// ��ȡ option ����

            this.addClickEvent();// ��ӵ���¼�
            this.$multiSelect.find('.multiSelect-options').hide();// Ĭ�� ������ ����
        },

        // ����htmlԪ��, ��ʼ������ $multiSelect
        appendHtml: function( $parent, width ){

            var _str = '<div class="multiSelect">' +
                            '<div class="multiSelect-result"></div>' +
                            '<div class="multiSelect-options"></div>' +
                        '</div>';

            this.$multiSelect = $( _str );
            this.$multiSelect.css( 'width', width );// ���� ��ѡ�����б�Ŀ��

            $parent.append( this.$multiSelect );// ����
        },

        // ��ȡ option ���ݣ���������ȡoption��url����ȡoption��data��option��value�ֶΡ�option��text�ֶΣ�
        getOptions: function( getOptionURL, getOptionData, optionValue, optionText ){
            var _self = this;

            // ��������
            this.postData( getOptionURL, getOptionData, function( data ){
                //console.log( data );
                data = data.data;

                var _content = '';
                for( var i=0; i < data.length; i++ ){
                    _content += '<option value="' + data[i][optionValue] + '">' + data[i][optionText] + '</option>';
                }
                _self.$multiSelect.find('.multiSelect-options').html( _content );// ����option

            }, function(){
                alertg('��ȡ�����б�����ʧ�ܣ�')
            });
        },


        // ���� ĳ�� resultBox��ʽ ��������ĳ�� .resultBox ��jq����
        setResultBoxStyle: function( $resultBox ){

            var _height = $resultBox.height();

            // ���� ��ѡ��� resultBox ����Ԫ�ص� �߶ȣ���ֱ���У�
            $resultBox.children().css( 'height', _height + 'px' );

            // ���� ��ѡ��� resultBox �� margin ����ֱ���У�
            //$resultBox.css( 'margin-top', ( $resultBox.parent().height() - _height ) / 2  + 'px' );
        },

        // ��ӵ���¼�
        addClickEvent: function(){

            var _self = this;

            // ���� �����б������հ׳�����:root����ȫ����
            $(document).on('click', ':root', function(e){
                _self.$multiSelect.find('.multiSelect-result').removeClass('focusClass');// ʧȥ ������ʽ
                _self.$multiSelect.find('.multiSelect-options').hide();// ���������б���
            });

            // չ�� �����б���
            _self.$multiSelect.on('click', '.multiSelect-result', function(e){

                // �� $(document).on �����Ȳ�׽ ����¼���
                // ���$(document).on���� ���ɾ����ť �¼������ɾ����ť��Ҳ�Ǳ��¼� �ȱ���׽ִ��
                e.stopImmediatePropagation();// �����ϴ����¼�

                $(this).addClass('focusClass');// �õ� ������ʽ
                _self.$multiSelect.find('.multiSelect-options').show();// չ�������б���
            });

            // ��� �����б����� ĳһ��
            _self.$multiSelect.on('click', '.multiSelect-options option', function(e){

                e.stopImmediatePropagation(); // �����ϴ����¼�

                var $str = $('<div class="resultBox">' +
                                '<div>' +
                                    '<span class="item" value="' + $(this).val() + '">' + $(this).text() + '</span> ' +
                                    '<span class="removeItem">&times;</span> ' +
                                '</div>' +
                            '</div>');

                _self.$multiSelect.find('.multiSelect-result').append( $str );// ѡ�У����
                _self.setResultBoxStyle( $str ); // ���� resultBox��ʽ
                _self.addRemoveItemClickEvent( $('.removeItem', $str) );// ��� ɾ����ť һ���Ե���¼�

                $(this).remove();// �Ƴ� ��ѡ��� ������
            });

        },

        // ��� ɾ����ť һ���Ե���¼���������ɾ����ťjq����
        addRemoveItemClickEvent: function( $item ){
            var _self = this;

            $item.one( 'click', function(e){

                e.stopImmediatePropagation(); // �����ϴ����¼�
                var $item = $(this).prev('.item');

                var $str = $('<option value="' + $item.attr('value') + '">' + $item.text() + '</option>');
                _self.$multiSelect.find('.multiSelect-options').prepend( $str );// �����Ƴ������ӵ������б�

                $(this).parents('.resultBox').remove();// �Ƴ�
            });
        },


        // post����
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

