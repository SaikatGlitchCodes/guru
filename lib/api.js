const BACKENDAPI = process.env.NEXT_PUBLIC_EXTERNAL_API_URL

export const updateProfile = async (profile, email) => {
    const response = await fetch(`${BACKENDAPI}/users/${email}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
    });
    
    if (!response.ok) {
        throw new Error('Failed to update profile');
    }
    const data = await response.json();
    console.log('Profile updated:', data);
    return data;
}