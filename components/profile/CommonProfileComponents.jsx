import React from 'react';
import PersonalInformation from './PersonalInformation';
import AccountInfo from './AccountInfo';
import ProfileDetails from './ProfileDetails';
import AddressInfo from './AddressInfo';

export default function CommonProfileComponents({ form }) {
    return (
        <>
            <PersonalInformation form={form} />
            <AccountInfo form={form} />
            <ProfileDetails form={form} />
            <AddressInfo form={form} />
        </>
    )
}
