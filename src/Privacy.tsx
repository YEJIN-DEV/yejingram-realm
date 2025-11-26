
const Privacy = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            <h1 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Privacy Policy for Yejingram Realm</h1>
            <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

            <section style={{ marginBottom: '20px' }}>
                <h2>1. Introduction</h2>
                <p>
                    Welcome to <strong>Yejingram Realm</strong>. We respect your privacy and are committed to protecting your personal data.
                    This privacy policy explains how we collect, use, and safeguard your information when you use our service.
                </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2>2. Information We Collect</h2>
                <p>
                    To provide our services, specifically for managing uploader accounts, we collect the following personal information:
                </p>
                <ul>
                    <li><strong>User ID:</strong> A unique identifier for your account.</li>
                    <li><strong>Email Address:</strong> Used for account verification and communication.</li>
                    <li><strong>Password:</strong> Securely stored to protect your account access.</li>
                    <li><strong>Nickname:</strong> Your public display name within the service.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2>3. How We Use Your Information</h2>
                <p>
                    The data we collect is used strictly for the following purposes:
                </p>
                <ul>
                    <li>To create and manage your account on Yejingram Realm.</li>
                    <li>To authenticate you when you log in to the service.</li>
                    <li>To identify you as an uploader within the system.</li>
                </ul>
                <p>
                    We do not sell or share your personal information with third parties for marketing purposes.
                </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2>4. Data Security</h2>
                <p>
                    We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2>5. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us.
                </p>
            </section>
        </div>
    );
};

export default Privacy;