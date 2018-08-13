function displayDonationPrompt(){
    $.dialog({
        title: 'Donate',
        content: `<div style="text-align:center;">
                <div>
                    <div onclick="javascript:tezpayment()" class="chip" style="cursor: pointer;">
                        <img src="img/tez_logo2.png" alt="Tez" width="95" height="95"> Tez
                    </div>
                </div>
                <br>
                <div><a onclick="javascript:logPaypal()" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KQJAX48SPUKNC" target="_blank"><img src="img/support_paypal.svg" width="200px"></a></div>
                <br>
                <div><a onclick=""javascript:logPateron()" href="https://www.patreon.com/bePatron?u=9531404"  target="_blank"><img src="img/support_patreon.svg" width="200px"></a></div>
            <div>`,
        escapeKey: true,
        backgroundDismiss: true,
    });
}

function tezpayment(){
    $.dialog({
        title: "Tez Payment",
        content: "<p>Please scan the below QR code or use UPI : amitgupta.gwl@okhdfcbank</p>" + '<img src="img/tez_qrcode.png">'
    })
    gtag('event', 'click', {
        'event_category': 'outbound',
        'event_label': "tez",
        'transport_type': 'beacon',
    });
}

function logPaypal(){
    gtag('event', 'click', {
        'event_category': 'outbound',
        'event_label': "paypal",
        'transport_type': 'beacon',
    });
}

function logPateron(){
    gtag('event', 'click', {
        'event_category': 'outbound',
        'event_label': "patreon",
        'transport_type': 'beacon',
    });
}


