<?php

        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://fotka.salesdrive.me/handler/',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>'{
            "form" : "DKooe-JJggzbJC-sfXadyfYJdFk3r9eyulTnIE7yeI8JyJf7dHeEJjToaemPWwmiv2sdJp",
                "getResultData": "0",
            "fName": "Имя",
            "lName": "Фамилия",
            "phone": "+39999999999",
            "email": "test@test",
            "description": "Описание заявки",
            "products": [
                    {
                    "id": "1",
                    "costPerItem": "240",
                    "amount": "1",
                    "description": "Фотогрaфії"
                    }
                ],
                "payment_status": "paid",
                "shipping_method": "id_9",
                "shipping_address": "ул. Пушкина, д.10",
                "novaposhta": {
                    "ServiceType": "WarehouseWarehouse",
                    "payer": "recipient",
                    "area": "Киевская",
                    "region": "Киевский",
                    "city": "Киев",
                    "cityNameFormat": "short",
                    "WarehouseNumber": "1"
                }
            }
        ',
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Form-Api-Key: DKooe-JJggzbJC-sfXadyfYJdFk3r9eyulTnIE7yeI8JyJf7dHeEJjToaemPWwmiv2sdJp',
            'Cookie: _csrf=f-ZW915mdzTXhBsETAfMVsPRWnIgYOmv'
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        echo $response;

?>