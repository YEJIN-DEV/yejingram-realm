const TOS = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            <h1 style={{ borderBottom: '1px solid var(--color-border-strong)', paddingBottom: '10px' }}>Terms of Service for Yejingram Realm</h1>
            <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

            <section style={{ marginBottom: '20px' }}>
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using <strong>Yejingram Realm</strong>, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2>2. Service Description</h2>
                <p>
                    Yejingram Realm provides a platform for uploaders to distribute their characters. We act solely as a distribution service provider.
                </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2>3. User Responsibilities and Content Ownership</h2>
                <p>
                    Uploaders can upload their characters to the service. By uploading content, you acknowledge and agree that:
                </p>
                <ul>
                    <li>All characters and content uploaded are entirely under the uploader's responsibility.</li>
                    <li>Yejingram Realm provides only the distribution mechanism and does not claim ownership of the uploaded content.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2>4. Content Policy and Removal</h2>
                <p>
                    We reserve the right to remove any content that violates applicable laws or regulations. Any content found to be in violation of the law may be removed immediately and without prior notice.
                </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2>5. Disclaimer of Liability</h2>
                <p>
                    <strong>Yejingram Realm does not assume responsibility for any content uploaded by users.</strong>
                </p>
                <p>
                    We support the distribution system only. Any problems, damages, or disputes arising from the use of the service or the content provided therein are the user's own responsibility. All users must acknowledge and accept this risk before using the service.
                </p>
            </section>
        </div>
    );
};

export default TOS;