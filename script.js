$(document).ready(function() {
  
  $('#number').on('input', function() {
    this.value = Math.abs(this.value);
  });
  $('input[type=radio][name=cpf_cnpj]').change(function() {
    if (this.value == 'cpf') {
      $('#cpf_field').show();
      $('#cnpj_field').hide();
      $('#cpf_number').mask('000.000.000-00', {reverse: true});
    }
    else if (this.value == 'cnpj') {
      $('#cpf_field').hide();
      $('#cnpj_field').show();
      $('#optional_fields').show();
      $('#cnpj_number').mask('00.000.000/0000-00', {reverse: true});
    }
  });

  $("input[type='radio'][name='cpf_cnpj']").change(function(){
    if (this.value === 'cnpj') {
      $("#optional_fields").show();
    } else {
      $("#optional_fields").hide();
    }
  });

  $('#client-form').on('submit', function(e) {
    e.preventDefault();

    var name = $('#name').val();
    var cpfCnpj = $("input[type='radio'][name='cpf_cnpj']:checked").val();
    var cpfCnpjNumber = cpfCnpj === 'cpf' ? $('#cpf_number').val() : $('#cnpj_number').val();
    var ie = $('#ie').val();
    var produtorRural = $("input[type='radio'][name='produtor_rural']:checked").val();
    var cep = $('#cep').val();
    var street = $('#street').val();
    var number = $('#number').val();
    var complement = $('#complement').val();
    var district = $('#district').val();
    var city = $('#city').val();
    var phone = $('#phone').val();
    var mobile = $('#mobile').val();
    var email = $('#email').val();
    var fornecedor = $('#fornecedor').val();

    var formattedMessage = `Olá, quero fazer meu cadastro na loja, meu nome é ${name}. \nCpf/Cnpj: ${cpfCnpjNumber},\nIE:${ie},\nProdutor Rural: ${produtorRural},\nCep: ${cep},\n${street},\nNúmero: ${number},\nComplemento: ${complement},\nBairro: ${district},\nCidade: ${city},\nTelefone: ${phone},\nCelular: ${mobile},\nFornecedor: ${fornecedor},\nE-mail: ${email}`;

    var phoneNumber = '5519996438475';
    var url = 'https://api.whatsapp.com/send?phone=' + phoneNumber + '&text=' + encodeURIComponent(formattedMessage);
    window.location.href = url;
  });

  // Máscaras para os outros campos
  $('#cep').mask('00000-000', {reverse: true});
  $('#phone').mask('(00) 0000-0000', {reverse: false});
  $('#mobile').mask('(00) 0 0000-0000', {reverse: false});

  // Evento de perda de foco do campo CEP
  $('#cep').blur(function() {
    var cep = $(this).val().replace('-', '');

    if (cep.length === 8) {
      var url = 'https://viacep.com.br/ws/' + cep + '/json/';

      $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(response) {
          if (!("erro" in response)) {
            $('#street').val(response.logradouro);
            $('#district').val(response.bairro);
            $('#city').val(response.localidade);
          } else {
            alert('CEP não encontrado.');
          }
        }
      });
    }
  });
});