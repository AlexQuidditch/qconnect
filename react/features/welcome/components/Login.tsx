/* eslint-disable require-jsdoc */
/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable react/no-multi-comp */
import React, {
    useState,
    ChangeEvent,
    useCallback
} from 'react';

import { getUserByHash, isDomainPremium, isUserPaid, redirectToPremium } from '../../../../modules/API/limitations.ts';

interface Props {
  onCloseLoginPrompt: () => void
}

interface InnerProps extends Props {
  error: string,
  handleInput: (e: ChangeEvent<HTMLInputElement>) => void,
  handleSubmit: () => void,
  isEnteringCode: boolean
}

interface RequestOptions {
  address: string,
  body: any,
  callback: () => void,
  error: string
}

const BOT_URL = 'https://bot.quasaria.ru/bot';

async function requestApi(address: string, body: any): Promise<any> {
    const request = await fetch([ BOT_URL, 'connect', address ].join('/'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return request.json();
}

async function checkAfterLogin(closeLoginPrompt: () => void): Promise<void> {
    const isPaid = await isUserPaid();

    console.log('checkAfterLogin:', { isPaid, isDomainPremium });

    if (!isDomainPremium && isPaid) {
        const userHash = await getUserByHash();

        console.log('checkAfterLogin:', { userHash });

        if (userHash) {
            redirectToPremium({ userHash });
        } else {
            closeLoginPrompt();
        }
    } else {
        closeLoginPrompt();
    }
}

function Login({ onCloseLoginPrompt: closeLoginPrompt }: Props): JSX.Element {
    const [ loginName, changeLoginName ] = useState('');
    const [ confirmationCode, changeConfirmationCode ] = useState('');
    const [ isEnteringCode, changeIsEnteringCode ] = useState(false);
    const [ error, setError ] = useState('');

    const options: { [key: string]: RequestOptions; } = {
        login: {
            address: 'send-code',
            body: {
                username: loginName
            },
            callback: () => {
                changeIsEnteringCode(true);
                setError('');
            },
            error: 'Пользователь не найден'
        },
        code: {
            address: 'check-code',
            body: {
                code: confirmationCode
            },
            callback: () => checkAfterLogin(closeLoginPrompt),
            error: 'Неверный код'
        }
    };

    const handleSubmit = useCallback(async () => {
        const { login, code } = options;
        const { address, body, callback, error: optionError } = isEnteringCode ? code : login;

        const res = await requestApi(address, body);

        if (res.status === 'OK') {
            if (isEnteringCode) {
                localStorage.setItem('username', res.username);
            }

            callback();
        } else {
            setError(optionError);
        }
    }, [ options, isEnteringCode ]);

    const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        isEnteringCode ? changeConfirmationCode(value) : changeLoginName(value);
    }, [ isEnteringCode ]);

    return (
        <InnerLogin
            error = { error }
            handleInput = { handleInput }
            handleSubmit = { handleSubmit }
            isEnteringCode = { isEnteringCode }
            onCloseLoginPrompt = { closeLoginPrompt } />
    );
}

function InnerLogin({
    onCloseLoginPrompt: closeLoginPrompt, handleInput, handleSubmit, error, isEnteringCode
}: InnerProps): JSX.Element {
    return (
        <div className = 'login'>
            <div className = 'login-form'>
                <div className = 'login-top'>
                    <h2>Войти</h2>
                    <button
                        className = 'interactive close'
                        onClick = { closeLoginPrompt }>
                        Закрыть
                    </button>
                </div>

                <input
                    className = 'interactive login-input'
                    key = { `isEnteringCode${isEnteringCode}` }
                    onChange = { handleInput }
                    placeholder = { isEnteringCode ? 'Код подтверждения' : 'Логин в Telegram' }
                    type = 'text' />

                {error && <p className = 'error'>{error}</p>}

                <button
                    className = 'interactive login-submit'
                    onClick = { handleSubmit }>
                    Отправить
                </button>
            </div>
        </div>
    );
}

export default Login;
