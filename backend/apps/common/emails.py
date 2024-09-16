from anymail.message import AnymailMessage


def send_email(*, subject: str, body: str, to: list, from_email: str = None, headers: dict = None):
    message = AnymailMessage(
        subject=subject,
        body=body,
        to=to,
        from_email=from_email,
        headers=headers,
    )
    message.send()

    return message.anymail_status.message_id
