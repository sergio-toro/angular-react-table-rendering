window.GPM = {
    user: {
        "id": 1,
        "username": "demo",
        "locale": "en",
        "timezone": "Europe/Madrid",
        "superAdmin": true,
        "date_format": {
            "constant": 1,
            "name": "30 Dic 2014",
            "momentjs": "DD MMM YYYY",
            "datepicker": "dd M yyyy",
            "backend": "d M Y",
            "month_momentjs": "MMM YYYY",
            "month_datepicker": "M yyyy",
            "month_backend": "M Y",
            "year_momentjs": "YYYY",
            "year_datepicker": "yyyy",
            "year_backend": "Y"
        },
        "time_format": {
            "constant": 1,
            "name": "19:23 (24h)",
            "frontend": "HH:mm",
            "backend": "H:i",
            "frontend_full": "HH:mm:ss",
            "backend_full": "H:i:s"
        },
        "number_format": {
            "constant": 3,
            "name": "10,000.00",
            "thousandsSep": ",",
            "decimalPoint": "."
        },
        "week_starts": {
            "constant": 1,
            "name": "Monday",
            "frontend": 1,
            "backend": 1
        }
    },
    SpecialFormatTypes: {"JEMA_INVERTER_ALARMS_FORMAT":{"constant":1,"name":"JEMA_INVERTER_ALARMS_FORMAT"},"BIDIRECCIONAL_COUNTER_DATE":{"constant":2,"name":"BIDIRECCIONAL_COUNTER_DATE"},"BIDIRECCIONAL_COUNTER_TIME":{"constant":3,"name":"BIDIRECCIONAL_COUNTER_TIME"},"BIDIRECCIONAL_COUNTER_DATE_EXTENDED":{"constant":4,"name":"BIDIRECCIONAL_COUNTER_DATE_EXTENDED"},"BIDIRECCIONAL_COUNTER_TIME_EXTENDED":{"constant":5,"name":"BIDIRECCIONAL_COUNTER_TIME_EXTENDED"},"METER_LOAD_PARAMETER":{"constant":6,"name":"METER_LOAD_PARAMETER"}},
    ProtocolCodeTypes: {"TRANSLATION_TABLE":{"constant":1,"name":"Translation value"},"SIMPLE_TRANSLATION_TABLE":{"constant":2,"name":"Translation of single value"},"BIT_DICTIONARY":{"constant":3,"name":"Translation bit"}},
};