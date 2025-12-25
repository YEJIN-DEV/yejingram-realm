export default {
    common: {
        yes: "Yes",
        no: "No",
        on: "On",
        off: "Off",
        unknown: "Unknown",
        anonymous: "Anonymous",
        not_specified: "Not Specified",
        name: "Name",
        gender: "Gender",
        tags: "Tags",
        phone: "Phone",
        load_more: "Load More",
    },
    header: {
        my_page: "My Page",
        logout: "Logout",
        login: "Login",
    },
    footer: {
        privacy_policy: "Privacy Policy",
        terms_of_service: "Terms of Service",
        all_rights_reserved: "All rights reserved.",
    },
    dashboard: {
        login_required: "Login is required for this menu",
        title: "{{name}}'s Dashboard",
        subtitle: "Manage your characters and check statistics.",
        upload_character: "Upload Character",
        register_new_character: "Register New Character",
        upload_description: "Register your own charming character and introduce it to users worldwide!",
        upload_instruction: "Click to start upload, or drag and drop a Yejingram PNG file.",
        my_character_list: "My Character List",
        manage: "Manage",
        sort: {
            name: "Name",
            popularity: "Popularity",
            views: "Views",
            downloads: "Downloads",
            upload_date: "Upload Date",
            update_date: "Update Date",
            asc: "Ascending",
            desc: "Descending",
        },
        stats: {
            popularity: "Popularity",
            views: "Views",
            downloads: "Downloads",
        }
    },
    character_modal: {
        title: {
            register: "Register New Character",
            edit: "Edit Character",
        },
        label: {
            status_message: "Status Message",
            summary: "Character Summary",
        },
        placeholder: {
            name: "Enter character name",
            status_message: "Enter a one-line status message for the character. Appeal your character's charm!",
            summary: "Please write a summary of the character. It helps other users understand the character.",
        },
        button: {
            register: "Register",
            update: "Update",
            delete: "Delete",
        },
        error: {
            invalid_file: "Invalid character file. Please upload a valid PNG file.",
            upload_file: "Please upload a character file.",
            enter_name: "Please enter a name.",
            enter_status: "Please enter a status message.",
            enter_summary: "Please enter a character summary.",
            select_nsfw: "Please select NSFW status.",
            no_changes: "No changes made to update!",
            register_fail: "Registration failed.",
            update_fail: "Update failed.",
            no_id: "No character ID to delete.",
            auth_required: "Authentication required.",
            delete_fail: "Deletion failed.",
            load_image_fail: "Failed to load image.",
        },
        notice: {
            thumbnail_update: "It may take a few seconds for the thumbnail and bot card to reflect.",
            thumbnail_update_edit: "It may take a few seconds for the changed thumbnail and bot card to reflect.",
        },
        status: {
            registering: "Registering character...",
            updating: "Updating character...",
            deleting: "Deleting character...",
        },
        success: {
            register: "Successfully registered!",
            update: "Successfully updated!",
            delete: "Successfully deleted!",
        },
        confirm_close: "All content in progress will be lost. Are you sure you want to close?",
        confirm_delete: "Are you sure you want to delete this character? Deleted characters cannot be recovered.",
        confirm_delete_final: "Are you really, really sure you want to delete this character? This action cannot be undone.",
    },
    search: {
        subtitle: " characters are waiting in Yejingram Realm. Find a character to be with!",
        placeholder: "Search characters by name, status message, description, tags...",
        recommended_keywords: "Recommended Keywords:",
        no_summary: "No summary available.",
        no_results: "No search results",
        try_other_keywords: "Try searching with other keywords.",
        total: "Total",
        characters_registered: "characters are registered.",
        button: "Search",
        pagination: {
            prev: "Previous Page",
            next: "Next Page",
        }
    },
    character_detail: {
        back_to_search: "Back to Search",
        lorebook_included: "Lorebook Included",
        sticker_included: "Sticker Included",
        open_in_yejingram: "Open in YEJINGRAM",
        uploader: "Uploader",
        upload_date: "Upload Date",
        update_date: "Update Date",
        basic_info: "Basic Info",
        no_status_message: "No status message",
        no_summary: "No summary available.",
        button: {
            download: "Download",
            chat: "Chat",
            back: "Back to List",
            share: "Share Contact",
        },
        share: {
            title: "Yejingram Contact: {{name}}",
            success: "URL copied to clipboard",
            failure: "Failed to copy URL",
        },
        license: {
            title: "License",
            this_character_is: "This character",
            follows: "follows the license.",
            cc_by: "Attribution",
            cc_nc: "NonCommercial",
            cc_nd: "NoDerivatives",
            cc_sa: "ShareAlike",
            conditions: "Available under conditions.",
            wtfpl_summary: "You can use it freely without restrictions.",
            wtfpl_learn_more: "Learn more",
        }
    },
    components: {
        copyright: {
            title: "Copyright Setting",
            not_set: "Not Set",
            cc_nc: "NonCommercial",
            cc_mod: "Modifications",
            allow: "Allow",
            cc_sa: "ShareAlike",
            cc_nd: "NoDerivatives",
            selected: "Selected License:",
        },
        data_preview: {
            title: "Data Preview",
            hint: "Upload an image to preview data",
            tab: {
                info: "Info",
                lorebook: "Lorebook",
                stickers: "Stickers",
            },
            info: {
                prompt: "Prompt",
                response_time: "Response Time",
                thinking_time: "Thinking Time",
                reactivity: "Reactivity",
                tone: "Tone",
                proactive_chat: "Proactive Chat",
            },
            lorebook: {
                no_name: "No Name",
                no_data: "No lorebook data.",
            },
            sticker: {
                no_data: "No sticker data available.",
            }
        },
        file_upload: {
            label: "Character File",
            upload_png: "Upload PNG File",
            instruction: "Click or drag to upload",
        },
        gender: {
            cancel: "Cancel Selection",
            female: "Female",
            male: "Male",
            other: "Other",
        },
        nsfw: {
            label: "NSFW (Contains explicit adult content)",
        },
        tag_input: {
            label: "Tags (Separated by commas)",
            placeholder: "Enter tags separated by commas",
        }
    },
    privacy: {
        title: "Privacy Policy",
        subtitle: "Yejingram Realm",
        last_updated: "Last updated: {{date}}",
        intro: {
            content: "<1>Yejingram Realm</1> (hereinafter referred to as \"the Service\") values users' personal information and is committed to complying with relevant laws such as the Personal Information Protection Act. This policy is written to transparently disclose what information is collected, how it is protected, and where it is entrusted for infrastructure operation when users use the Service."
        },
        collect: {
            labels: {
                items: "Collected Items",
                purpose: "Purpose"
            }
        },
        articles: {
            article1: {
                title: "Article 1 (Items of Personal Information Collected and Purpose of Use)",
                content: "The Service collects only the minimum personal information necessary for smooth service provision and security, and does not use it for purposes other than those specified.",
                items: [
                    {
                        title: "Account Management and Communication",
                        collect: "User ID, Email Address, Password (Encrypted)",
                        purpose: "Member registration and identification, account management, delivery of important service-related notices, response to inquiries."
                    },
                    {
                        title: "Security and Fraud Prevention",
                        collect: "Access IP Address",
                        purpose: "Blocking abnormal access, preventing hacking, and maintaining service stability."
                    },
                    {
                        title: "Service Quality Improvement",
                        collect: "Vercel Web Analytics and Speed Insights Data (De-identified usage records)",
                        purpose: "Website performance monitoring, error diagnosis, and user experience optimization."
                    }
                ]
            },
            article2: {
                title: "Article 2 (Retention and Use Period of Personal Information)",
                content: "In principle, users' personal information is destroyed without delay once the purpose of collection is achieved.",
                items: [
                    {
                        title: "Account Information",
                        content: "Destroyed immediately upon membership withdrawal."
                    },
                    {
                        title: "Access IP Address",
                        content: "Collected for fraud prevention and automatically destroyed within 10 minutes of collection."
                    },
                    {
                        title: "Service Usage Data",
                        content: "Retained until the purpose of analysis and optimization is achieved, and then destroyed without delay."
                    }
                ]
            },
            article3: {
                title: "Article 3 (Entrustment of Personal Information Processing and Overseas Transfer)",
                content: "The Service entrusts personal information processing to specialized companies to provide stable infrastructure, and due to the nature of the service, data is transferred overseas as follows.",
                table: {
                    headers: ["Trustee (Country)", "Transferred/Entrusted Items", "Purpose of Transfer and Tasks", "Retention and Use Period"],
                    rows: [
                        {
                            company: "Amazon Web Services, Inc. (USA/Korea)",
                            items: "All items collected in Article 1",
                            task: "AWS Seoul Region (ap-northeast-2) cloud infrastructure operation and data storage, Cognito authentication",
                            period: "Until membership withdrawal or termination of entrustment"
                        },
                        {
                            company: "Vercel Inc. (USA)",
                            items: "Access IP, Analytics data",
                            task: "Website hosting and analytics tool provision",
                            period: "Until analysis completion"
                        }
                    ]
                },
                transfer_info: [
                    { label: "Transfer Method", value: "Encrypted transmission via network during service use" },
                    { label: "Transferred Countries", value: "Republic of Korea (Seoul Region) and USA (Headquarters management authority)" }
                ]
            },
            article4: {
                title: "Article 4 (Matters Related to Global Users)",
                items: [
                    {
                        title: "Data Transfer for Users Residing Overseas",
                        content: "If you access the Service from outside Korea, your information will be transferred to and stored in the Republic of Korea, where the service infrastructure is located, and the USA, where the trustee's headquarters are located. By using the Service, you are deemed to have consented to this."
                    },
                    {
                        title: "Protection Standards",
                        content: "The Service applies standard security technologies such as SSL/TLS encryption when transferring data between countries to safely protect data."
                    }
                ]
            },
            article5: {
                title: "Article 5 (Personal Information Security Measures)",
                content: "The Service takes the following measures to maintain a high level of technical security.",
                items: [
                    {
                        title: "Password Encryption",
                        content: "User passwords are stored after one-way encryption through AWS Cognito, a global authentication standard. No one, including the operator, can view the user's password."
                    },
                    {
                        title: "Data Transmission Protection",
                        content: "All data communication is protected via SSL/TLS encryption (HTTPS)."
                    },
                    {
                        title: "Access Log Management",
                        content: "IP addresses remain for a minimum time (10 minutes) only for security purposes and are completely deleted through periodic automated scripts."
                    }
                ]
            },
            article6: {
                title: "Article 6 (Rights of Data Subjects and How to Exercise Them)",
                content: "Users may view or modify their personal information at any time and have the right to withdraw their consent to the use of personal information through membership withdrawal. Related requests can be made through 'Account Settings' within the service or the contact information in Article 8."
            },
            article7: {
                title: "Article 7 (Privacy Security and Hacking Disclaimer)",
                items: [
                    {
                        title: "Limitations of Security",
                        content: "The operator strives to apply the best protection measures utilizing the latest security infrastructure of AWS and Vercel, but perfect security cannot be guaranteed due to the nature of the internet environment."
                    },
                    {
                        title: "Disclaimer",
                        content: "Unless there is gross negligence on the part of the operator, the operator shall not be liable for information leakage or data loss caused by illegal intrusion (hacking) by third parties or unexpected server failures."
                    },
                    {
                        title: "User Precautions",
                        content: "Users are solely responsible for security accidents resulting from negligent management of their account information and passwords."
                    }
                ]
            },
            article8: {
                title: "Article 8 (Chief Privacy Officer and Contact Information)",
                content: "Please submit any complaints or inquiries related to personal information arising during the use of the service to the contact information below.",
                contact: {
                    name: "Name: Yejingram Realm Operator",
                    email: "Email: <1>support@yejingram.com</1>"
                }
            }
        }
    },
    tos: {
        title: "Terms of Service",
        subtitle: "Yejingram Realm",
        last_updated: "Last updated: {{date}}",
        articles: {
            article1: {
                title: "Article 1 (Agreement to Terms)",
                content: "By accessing and using Yejingram Realm (hereinafter referred to as \"the Service\"), you agree to all terms and conditions of this Agreement. If you do not agree to these terms, your use of the Service may be restricted."
            },
            article2: {
                title: "Article 2 (Purpose of Service and Status as Intermediary)",
                content: [
                    "The Service provides the technical infrastructure and platform for users to upload and distribute characters and related content.",
                    "The Service acts solely as a simple distribution service provider (Intermediary) and is not involved in the creation, editing, or inspection of content uploaded by users.",
                    "The Operator does not intervene in content-related transactions or disputes between users and third parties and bears no responsibility for them."
                ]
            },
            article3: {
                title: "Article 3 (User Responsibility and Content Ownership)",
                content: [
                    "Users retain all legal rights and responsibilities for the content they upload.",
                    "By uploading content, you warrant that such content does not infringe upon the copyrights, trademark rights, or other intellectual property rights and other rights of third parties.",
                    "All civil and criminal liability arising in connection with the content lies entirely with the uploader, and the Service shall not be liable for any damages caused by information distributed by the user under any circumstances."
                ]
            },
            article4: {
                title: "Article 4 (Content Policy and Operator Rights)",
                content: [
                    "The Operator reserves the right to immediately delete or block access to content without prior notice if it is judged to violate relevant laws or these Terms, or infringe upon the rights of others.",
                    "The Operator may review content in the event of technical defects or upon receipt of a report, but is not obligated to inspect all content in advance."
                ]
            },
            article5: {
                title: "Article 5 (Disclaimer on Data Retention and Service Interruption)",
                subsections: [
                    {
                        title: "Infrastructure Dependency",
                        content: "The Service operates based on third-party external infrastructure such as Amazon Web Services (AWS) and Vercel."
                    },
                    {
                        title: "Infrastructure Failure Disclaimer",
                        content: "The Operator shall not be liable for any service interruptions or data inaccessibility caused by service defects of third parties that are beyond the Operator's direct control, such as server failures, network delays, or region outages of AWS or Vercel."
                    },
                    {
                        title: "Data Backup Obligation",
                        content: "Users are responsible for backing up the original files and data uploaded to the Service. The Operator is not obligated to recover data lost or damaged due to infrastructure failures."
                    },
                    {
                        title: "Service Interruption",
                        content: "The Operator may temporarily or permanently suspend all or part of the Service if necessary for operational reasons such as infrastructure maintenance, replacement, or failure."
                    }
                ]
            },
            article6: {
                title: "Article 6 (Privacy Security and Hacking Disclaimer)",
                content: [
                    "The Operator strives to protect users' personal information in accordance with relevant laws.",
                    "Due to the nature of the internet environment, perfect security cannot be guaranteed. Therefore, unless there is intentional or gross negligence on the part of the Operator, the Operator shall not be liable for information leakage or data damage caused by illegal access (hacking) by third parties or security accidents.",
                    "Users are solely responsible for all security accidents resulting from negligent management of their account information, such as ID, email, and password."
                ]
            },
            article7: {
                title: "Article 7 (Disclaimer of Warranties and Limitation of Liability)",
                subsections: [
                    {
                        title: "AS-IS Principle",
                        content: "The Service is provided on an 'As-Is' basis. The Operator makes no express or implied warranties regarding the uninterrupted operation, integrity, or fitness for a particular purpose of the Service."
                    },
                    {
                        title: "Limitation of Damages Scope",
                        content: "The Operator shall not be liable for damages caused by the following reasons:",
                        list: [
                            "Failure or interruption of third-party infrastructure services (AWS, Vercel, etc.)",
                            "Force majeure events such as natural disasters, war, or national emergencies",
                            "Service usage obstacles or data leakage caused by the user's negligence",
                            "Disputes with third parties arising from content uploaded by the user"
                        ]
                    },
                    {
                        title: "Indemnification",
                        content: "If the Operator suffers damages due to the user's violation of these Terms, the user must compensate for all damages, including the Operator's legal fees."
                    }
                ]
            }
        },
        disclaimer: "Yejingram Realm is operated as an open-source project and is a wrapper service utilizing AWS and Vercel infrastructure. The Operator does not guarantee the continuity of the Service, data integrity, or availability at any specific point in time."
    }
};
