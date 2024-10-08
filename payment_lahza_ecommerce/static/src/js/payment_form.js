/* global Stripe */
odoo.define('payment_lahza_ecommerce.payment_form', require => {
    'use strict';

    var ajax = require('web.ajax');
    var core = require('web.core');

    const checkoutForm = require('payment.checkout_form');
    const manageForm = require('payment.manage_form');

    const lahzaMixin = {

        /**
         * Redirect the customer to Lahza hosted payment page.
         *
         * @override method from payment.payment_form_mixin
         * @private
         * @param {string} provider - The provider of the payment option's acquirer
         * @param {number} paymentOptionId - The id of the payment option handling the transaction
         * @param {object} processingValues - The processing values of the transaction
         * @return {undefined}
         */
        _processRedirectPayment: function (provider, paymentOptionId, processingValues) {
            if (provider !== 'lahza') {
                return this._super(...arguments);
            }

            console.log(processingValues);
            let handler = LahzaPop.setup({
                key: processingValues['pub_key'],
                email: processingValues['email'],
                currency: processingValues['currency'],
                amount: processingValues['amount'] * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit
                ref: processingValues['reference'],
    
       
                callback: function(response){
          
                    let ref = response;
                    console.log("Response: " + ref);
                    ajax.jsonRpc("/payment/lahza/checkout/return", 'call', {
                        data : response,
                        // ref: response.reference;
                    }).then(function(data){
                        // window.location.href = data;
                        console.log("Payment Successful: " + data);
                        window.location.href = data;
                        
                    }).catch(function(data){
                        var msg = data && data.data && data.data.message;
                        var wizard = $(qweb.render('lahza.error', {'msg': msg || _t('Payment error')}));
                        wizard.appendTo($('body')).modal({'keyboard': true});
                    });
          
                },
                onClose: function() {
                  alert('Transaction was not completed, window closed.');
                },

            });
            handler.openIframe();


            console.log("redirected to checkout page");
        },

        /**
         * Prepare the options to init the Lahza JS Object
         *
         * Function overriden in internal module
         *
         * @param {object} processingValues
         * @return {object}
         */
        _prepareLahzaOptions: function (processingValues) {
            return {};
        },
    };

    checkoutForm.include(lahzaMixin);
    manageForm.include(lahzaMixin);

});