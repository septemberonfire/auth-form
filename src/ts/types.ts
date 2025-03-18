type Country = {
    code: string,
    dial_code: string,
    flag: string,
    name: string,
}

type SelectOption = {
    id: string,
    name: string,
    html: string,
    type?: string,
    is_active?: boolean,
    link?: string,
    description?: string,
    timeout?: number
}

type Form = {
    stepOne: {
        country: {
            options: SelectOption[],
            value: string | null
        },
        phone: string | null,
    },
    stepTwo: {
        type: {
            options: SelectOption[],
            value: string | null,
        },
        code: string | null,
    }
}

type Error = {
    country: string | null,
    phone: string | null,
    type: string | null,
    code: string | null,
}

type CreateResponse = {
    captcha_api_key: null | string,
    captcha_required: boolean,
    client_channels: {
        description: string,
        image_url: string,
        is_active: boolean,
        link: string,
        name: string,
        sorting: number,
        timeout: number,
        type: string,
    } [],
    code_format: {
        length: number,
        digits: boolean,
        letters: boolean
    },
    sent_to: string,
    session_id: string
}

type SendResponseError = {
    response: {
        data: {
            error: string,
            error_params: {},
            status: number,
            success: boolean,
            sys_message: string,
        },
        status: number,
        statusText: string,
    },
    status: 400
}

type SendResponse = {
    client_channel: {
        description: string,
        image_url: string,
        is_active: boolean,
        link: string,
        name: string,
        sorting: number,
        timeout: number,
        type: string,
    },
    session_id: string
}

type CheckResponseError = {
    response: {
        data: {
            error: string,
            error_params: {count: number},
            status: number,
            success: boolean,
            sys_message: string
        },
        status: number,
        statusText: string,
    },
    status: 400
}

type CheckResponse = {
    is_test: false,
    verify_token: string,
}

export type { Country, Form, Error, CreateResponse, SendResponseError, SendResponse, CheckResponseError, CheckResponse }