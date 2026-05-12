'use client'

import {EmailChangeSettings} from './email-change-settings'
import {EmailVerifySettings} from './email-verify-settings'

type Props = {
    readonly email: string
    readonly userId: number
}

export function EmailSettings({email, userId}: Props) {
    return (
        <div className="space-y-4">
            <EmailChangeSettings email={email} userId={userId}/>
            <EmailVerifySettings email={email} userId={userId}/>
        </div>
    )
}

