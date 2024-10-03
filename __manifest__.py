# -*- coding: utf-8 -*-
{
    'name': "Lahza",
    'category': 'Accounting/Payment Acquirers',
    'sequence': -100,
    'summary': 'Lahza Payment Method',
    'author': 'Lahza<support@lahza.io>',
    'description': """Lahza Payment Method""",
    'depends': ['payment'],
    'data': [
        # 'security/ir.model.access.csv',
        'views/payment_views.xml',
        'views/payment_templates.xml',
        'data/payment_acquirer_data.xml',
    ],
    'images': ['static/description/icon.jpg'],
    'application': True,
    'uninstall_hook': 'uninstall_hook',
    'installable': True,
    'assets': {
        'web.assets_frontend': [
            'payment_lahza_ecommerce/static/src/js/payment_form.js',
        ],
    },
    'license': 'LGPL-3',

}
