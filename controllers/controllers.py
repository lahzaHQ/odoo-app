# -*- coding: utf-8 -*-
import logging
import pprint

from odoo import http
from odoo.http import request
from odoo.exceptions import ValidationError

_logger = logging.getLogger(__name__)


class LahzaController(http.Controller):
    _checkout_return_url = "/payment/lahza/checkout/return"
    _notify_url = "/payment/lahza/notify"
    
    @http.route(
        _checkout_return_url, type='json', auth='public', methods=['GET','POST'], csrf=False,
        save_session=False
    )
    def lahza_return(self, **data):
        """ Process the data returned by Lahza after redirection."""
        _logger.info("Lahza return data:\n%s", pprint.pformat(data))
        request.env['payment.transaction'].sudo()._handle_feedback_data('lahza', data)
        return '/payment/status'
        # return request.redirect('/payment/status')

    
    @http.route(_notify_url, type='http', auth='public', methods=['POST'], csrf=False)
    def lahza_notify(self, **data):
        """ Process the data sent by Lahza to the webhook.
        :return: An empty string to acknowledge the notification
        :rtype: str
        """
        _logger.info("Lahza notify data:\n%s", pprint.pformat(data))
        try:
            request.env['payment.transaction'].sudo()._handle_feedback_data('lahza', data)
        except ValidationError:  # Acknowledge the notification to avoid getting spammed
            _logger.exception("unable to handle the notification data; skipping to acknowledge")
        return ''  # Acknowledge the notification with an HTTP 200 response