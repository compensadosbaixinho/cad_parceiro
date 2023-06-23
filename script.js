$(document).ready(function() {

  function removeAccents(str) {
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ';
    var accentsOut = "AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuyNn";
    str = str.split('');
    str.forEach((letter, index) => {
        var i = accents.indexOf(letter);
        if (i !== -1) {
            str[index] = accentsOut[i];
        }
    })
    return str.join('');
  }
  
  
  $('#number').on('input', function() {
    this.value = Math.abs(this.value);
  });

  $('#rg_number').on('input', function() {
    this.value = this.value.replace(/[^0-9.-]/g, '').slice(0, 12);
});

$('#sec_address_check').change(function() {
  if(this.checked) {
    $('#sec_address').slideDown();
  } else {
    $('#sec_address').slideUp();
  }
});


  $('input[type=radio][name=cpf_cnpj]').change(function() {
    if (this.value == 'cpf') {
      $('#cpf_field').show();
      $('#cnpj_field').hide();
      $('#rg_field').show(); // Mostra o campo RG
      $('#cpf_number').mask('000.000.000-00', {reverse: true});
    }
    else if (this.value == 'cnpj') {
      $('#cpf_field').hide();
      $('#rg_field').hide(); // Esconde o campo RG
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

    var name = removeAccents($('#name').val().toUpperCase());
    var cpfCnpj = $("input[type='radio'][name='cpf_cnpj']:checked").val();
    var cpfCnpjNumber = cpfCnpj === 'cpf' ? removeAccents($('#cpf_number').val().toUpperCase()) : removeAccents($('#cnpj_number').val().toUpperCase());
    var rgNumber = cpfCnpj === 'cpf' ? removeAccents($('#rg_number').val().toUpperCase()) : null;
    var ie = removeAccents($('#ie').val().toUpperCase());
    var produtorRural = $("input[type='radio'][name='produtor_rural']:checked").val();
    var cep = removeAccents($('#cep').val().toUpperCase());
    var street = removeAccents($('#street').val().toUpperCase());
    var number = removeAccents($('#number').val().toUpperCase());
    var complement = removeAccents($('#complement').val().toUpperCase());
    var district = removeAccents($('#district').val().toUpperCase());
    var city = removeAccents($('#city').val().toUpperCase());

    var secAddressCheck = $('#sec_address_check').prop('checked');
    var cep2 = secAddressCheck ? removeAccents($('#cep2').val().toUpperCase()) : null;
    var street2 = secAddressCheck ? removeAccents($('#street2').val().toUpperCase()) : null;
    var number2 = secAddressCheck ? removeAccents($('#number2').val().toUpperCase()) : null;
    var complement2 = secAddressCheck ? removeAccents($('#complement2').val().toUpperCase()) : null;
    var district2 = secAddressCheck ? removeAccents($('#district2').val().toUpperCase()) : null;
    var city2 = secAddressCheck ? removeAccents($('#city2').val().toUpperCase()) : null;

    var phone = removeAccents($('#phone').val().toUpperCase());
    var mobile = removeAccents($('#mobile').val().toUpperCase());
    var email = removeAccents($('#email').val());
    var fornecedor = removeAccents($('#fornecedor').val().toUpperCase());
    

    var formattedMessage = `Olá, quero fazer meu cadastro na loja, meu nome é ${name}. \nCpf/Cnpj: ${cpfCnpjNumber},\nRG: ${rgNumber},\nIE:${ie},\nProdutor Rural: ${produtorRural},\nCep: ${cep},\n${street},\nNúmero: ${number},\nComplemento: ${complement},\nBairro: ${district},\nCidade: ${city},\nTelefone: ${phone},\nCelular: ${mobile},\nReferências: ${fornecedor},\nE-mail: ${email}`;

    if(secAddressCheck) {
      formattedMessage += `\nPossuo um endereço de entrega secundário: \nCep: ${cep2},\nRua: ${street2},\nNúmero: ${number2},\nComplemento: ${complement2},\nBairro: ${district2},\nCidade: ${city2}`;
    }
    
    var phoneNumber = '5519998337623';
    var url = 'https://api.whatsapp.com/send?phone=' + phoneNumber + '&text=' + encodeURIComponent(formattedMessage);
    window.location.href = url;
  });

  // Máscaras para os outros campos
  $('#cep').mask('00000-000', {reverse: true});
  $('#cep2').mask('00000-000', {reverse: true});
  $('#phone').mask('(00) 0000-0000', {reverse: false});
  $('#mobile').mask('(00) 0 0000-0000', {reverse: false});

  // Evento de perda de foco do campo CEP
  $('#cep2').blur(function() {
    var cep = $(this).val().replace('-', '');

    if (cep.length === 8) {
      var url = 'https://viacep.com.br/ws/' + cep + '/json/';

      $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(response) {
          if (!("erro" in response)) {
            $('#street2').val(response.logradouro);
            $('#district2').val(response.bairro);
            $('#city2').val(response.localidade);
          } else {
            alert('CEP não encontrado.');
          }
        }
      });
    }
  });

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