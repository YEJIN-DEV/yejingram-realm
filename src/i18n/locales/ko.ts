export default {
    common: {
        yes: "예",
        no: "아니오",
        on: "켜짐",
        off: "꺼짐",
        unknown: "알 수 없음",
        anonymous: "익명",
        not_specified: "지정되지 않음",
        name: "이름",
        gender: "성별",
        tags: "태그",
        phone: "전화번호",
        load_more: "더 보기",
    },
    header: {
        my_page: "마이페이지",
        logout: "로그아웃",
        login: "로그인",
    },
    footer: {
        privacy_policy: "개인정보처리방침",
        terms_of_service: "서비스 이용약관",
        all_rights_reserved: "All rights reserved.",
    },
    dashboard: {
        login_required: "로그인이 필요한 메뉴입니다",
        title: "{{name}}님의 대시보드",
        subtitle: "내 캐릭터를 관리하고 통계를 확인하세요.",
        upload_character: "캐릭터 업로드",
        register_new_character: "새로운 캐릭터 등록하기",
        upload_description: "나만의 매력적인 캐릭터를 등록하고 전 세계 유저들에게 소개해보세요!",
        upload_instruction: "클릭해서 업로드를 시작하거나, 예진그램 PNG 파일을 드래그 앤 드롭하세요.",
        my_character_list: "내 캐릭터 목록",
        manage: "관리",
        sort: {
            name: "이름순",
            popularity: "인기도순",
            views: "조회수순",
            downloads: "다운로드순",
            created_at: "업로드 날짜순",
            updated_at: "업데이트 날짜순",
            asc: "오름차순",
            desc: "내림차순",
        },
        stats: {
            popularity: "인기도",
            views: "조회수",
            downloads: "다운로드",
        }
    },
    character_modal: {
        title: {
            register: "새 캐릭터 등록",
            edit: "캐릭터 수정",
        },
        label: {
            status_message: "상태 메시지",
            summary: "캐릭터 소개",
        },
        placeholder: {
            name: "캐릭터 이름을 입력하세요",
            status_message: "캐릭터의 한 줄 상태 메시지를 입력하세요. 캐릭터의 매력을 한껏 어필해보세요!",
            summary: "캐릭터의 소개글을 작성해주세요. 다른 유저들이 캐릭터를 이해하는 데 도움이 됩니다.",
        },
        button: {
            register: "등록하기",
            update: "수정하기",
            delete: "삭제하기",
        },
        error: {
            invalid_file: "유효하지 않은 캐릭터 파일입니다. 올바른 형식의 PNG 파일을 업로드해주세요.",
            upload_file: "캐릭터 파일을 업로드해주세요.",
            enter_name: "이름을 입력해주세요.",
            enter_status: "상태메시지를 입력해주세요.",
            enter_summary: "캐릭터 소개를 입력해주세요.",
            select_nsfw: "NSFW 여부를 선택해주세요.",
            no_changes: "수정된 사항이 없어 업데이트할 수 없습니다!",
            register_fail: "등록에 실패했습니다.",
            update_fail: "수정에 실패했습니다.",
            no_id: "삭제할 캐릭터 ID가 없습니다.",
            auth_required: "인증이 필요합니다.",
            delete_fail: "삭제에 실패했습니다.",
            load_image_fail: "이미지를 불러오는데 실패했습니다.",
        },
        notice: {
            thumbnail_update: "썸네일과 봇카드가 반영되는 데 까지 몇 초 정도 걸릴 수 있습니다.",
            thumbnail_update_edit: "변경된 썸네일과 봇카드가 반영되는 데 까지 몇 초 정도 걸릴 수 있습니다.",
        },
        status: {
            registering: "캐릭터를 등록하는 중입니다...",
            updating: "캐릭터를 수정하는 중입니다...",
            deleting: "캐릭터를 삭제하는 중입니다...",
        },
        success: {
            register: "성공적으로 등록되었습니다!",
            update: "성공적으로 수정되었습니다!",
            delete: "성공적으로 삭제되었습니다!",
        },
        confirm_close: "작성중이던 내용이 전부 지워집니다. 정말 닫으시겠습니까?",
        confirm_delete: "정말로 이 캐릭터를 삭제하시겠습니까? 삭제된 캐릭터는 복구할 수 없습니다.",
        confirm_delete_final: "정말로, 정말로 이 캐릭터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    },
    search: {
        subtitle: "명의 캐릭터가 Yejingram Realm에서 기다리고 있어요. 함께할 캐릭터를 찾아보세요!",
        placeholder: "이름, 상태 메시지, 설명, 태그로 캐릭터를 검색해보세요...",
        recommended_keywords: "추천 키워드:",
        no_summary: "소개글이 없습니다.",
        no_results: "검색 결과가 없습니다",
        try_other_keywords: "다른 키워드로 검색해보세요.",
        total: "총",
        characters_registered: "개의 캐릭터가 등록되어 있습니다.",
        button: "검색",
        pagination: {
            prev: "이전 페이지",
            next: "다음 페이지",
        }
    },
    character_detail: {
        back_to_search: "검색창으로 돌아가기",
        lorebook_included: "로어북 포함됨",
        sticker_included: "스티커 포함됨",
        open_in_yejingram: "YEJINGRAM에서 열기",
        uploader: "업로더",
        upload_date: "업로드",
        update_date: "마지막 수정",
        basic_info: "기본 정보",
        no_status_message: "상태 메시지 없음",
        no_summary: "소개글이 없습니다.",
        button: {
            download: "다운로드",
            chat: "채팅하기",
            back: "목록으로",
            share: "연락처 공유하기",
        },
        share: {
            title: "예진그램 연락처: {{name}}",
            success: "URL이 복사되었습니다",
            failure: "URL 복사에 실패했습니다",
        },
        license: {
            title: "라이선스",
            this_character_is: "이 캐릭터는",
            follows: "라이선스를 따릅니다.",
            cc_by: "저작자 표시",
            cc_nc: "비영리",
            cc_nd: "변경 금지",
            cc_sa: "동일조건변경허락",
            conditions: "조건 하에 이용 가능합니다.",
            wtfpl_summary: "제약 없이 자유롭게 이용 가능합니다.",
            wtfpl_learn_more: "자세히 알아보기",
        }
    },
    components: {
        copyright: {
            title: "저작권 설정",
            not_set: "미설정",
            cc_nc: "비영리 (NonCommercial)",
            cc_mod: "변경 허락 (Modifications)",
            allow: "허용",
            cc_sa: "동일조건변경허락 (ShareAlike)",
            cc_nd: "변경 금지 (NoDerivatives)",
            selected: "선택된 라이선스:",
            wtfpl_desc: "제약 없이 자유롭게 이용 가능합니다.",
            wtfpl_link: "자세히 알아보기",
        },
        data_preview: {
            title: "데이터 미리보기",
            hint: "이미지를 업로드하면 데이터가 표시됩니다",
            tab: {
                info: "정보",
                lorebook: "로어북",
                stickers: "스티커",
            },
            info: {
                prompt: "프롬프트",
                response_time: "반응 속도",
                thinking_time: "생각하는 시간",
                reactivity: "반응성",
                tone: "톤",
                proactive_chat: "선톡 기능",
            },
            lorebook: {
                no_name: "이름 없음",
                no_data: "로어북 데이터가 없습니다.",
            },
            sticker: {
                no_data: "스티커 데이터가 없습니다.",
            }
        },
        file_upload: {
            label: "캐릭터 파일",
            upload_png: "PNG 파일 업로드",
            instruction: "클릭하거나 드래그하여 업로드",
        },
        gender: {
            cancel: "선택 취소",
            female: "여성",
            male: "남성",
            other: "기타",
        },
        nsfw: {
            label: "NSFW 여부 (명시적인 성인 묘사 포함)",
        },
        tag_input: {
            label: "태그 (쉼표로 구분)",
            placeholder: "태그를 입력하고 쉼표로 구분하세요",
        }
    },
    privacy: {
        title: "개인정보 처리방침",
        subtitle: "Yejingram Realm",
        last_updated: "최종 업데이트: {{date}}",
        intro: {
            content: "<1>Yejingram Realm</1>(이하 \"본 서비스\")은 사용자의 개인정보를 소중히 여기며, 개인정보 보호법 등 관련 법령을 준수하기 위해 최선을 다하고 있습니다. 본 방침은 사용자가 서비스를 이용할 때 어떠한 정보가 수집되고, 어떻게 보호되며, 인프라 운영을 위해 어디에 위탁되는지 투명하게 공개하기 위해 작성되었습니다."
        },
        collect: {
            labels: {
                items: "수집 항목",
                purpose: "수집 목적"
            }
        },
        articles: {
            article1: {
                title: "제1조 (개인정보의 수집 항목 및 이용 목적)",
                content: "본 서비스는 원활한 서비스 제공 및 보안을 위해 필요한 최소한의 개인정보만을 수집하며, 명시된 목적 외의 용도로는 사용하지 않습니다.",
                items: [
                    {
                        title: "계정 관리 및 커뮤니케이션",
                        collect: "사용자 ID, 이메일 주소, 비밀번호(암호화)",
                        purpose: "회원 가입 및 본인 식별, 계정 관리, 서비스 관련 중요 고지사항 전달, 문의 응대."
                    },
                    {
                        title: "보안 및 부정 이용 방지",
                        collect: "접속 IP 주소",
                        purpose: "비정상적인 접근 차단, 해킹 방지 및 서비스 안정성 유지."
                    },
                    {
                        title: "서비스 품질 개선",
                        collect: "Vercel Web Analytics 및 Speed Insights 데이터 (비식별화된 이용 기록)",
                        purpose: "웹사이트 성능 모니터링, 오류 진단 및 사용자 경험 최적화."
                    }
                ]
            },
            article2: {
                title: "제2조 (개인정보의 보유 및 이용 기간)",
                content: "사용자의 개인정보는 수집 목적이 달성되면 지체 없이 파기하는 것을 원칙으로 합니다.",
                items: [
                    {
                        title: "계정 정보",
                        content: "회원 탈퇴 시 즉시 파기합니다."
                    },
                    {
                        title: "접속 IP 주소",
                        content: "부정 사용 예방을 위해 수집하며, 수집 후 10분 이내에 자동 파기됩니다."
                    },
                    {
                        title: "서비스 이용 데이터",
                        content: "분석 및 최적화 목적이 달성될 때까지 보유하며, 이후 지체 없이 파기합니다."
                    }
                ]
            },
            article3: {
                title: "제3조 (개인정보 처리 위탁 및 국외 이전)",
                content: "본 서비스는 안정적인 인프라 제공을 위해 전문 업체에 개인정보 처리를 위탁하고 있으며, 서비스 특성상 아래와 같이 데이터가 국외로 이전됩니다.",
                table: {
                    headers: ["수탁업체 (국가)", "이전/위탁 항목", "이전 목적 및 업무", "보유 및 이용 기간"],
                    rows: [
                        {
                            company: "Amazon Web Services, Inc. (미국/한국)",
                            items: "제1조의 수집 항목 전체",
                            task: "AWS 서울 리전(ap-northeast-2) 클라우드 인프라 운영 및 데이터 저장, Cognito 인증",
                            period: "회원 탈퇴 또는 위탁 종료 시까지"
                        },
                        {
                            company: "Vercel Inc. (미국)",
                            items: "접속 IP, 분석 데이터",
                            task: "웹사이트 호스팅 및 분석 도구 제공",
                            period: "분석 완료 시까지"
                        }
                    ]
                },
                transfer_info: [
                    { label: "이전 방식", value: "서비스 이용 시 네트워크를 통한 암호화 전송" },
                    { label: "이전되는 국가", value: "대한민국(서울 리전) 및 미국(본사 관리 권한)" }
                ]
            },
            article4: {
                title: "제4조 (글로벌 사용자 관련 사항)",
                items: [
                    {
                        title: "국외 거주 사용자의 데이터 이전",
                        content: "한국 외 지역에서 본 서비스에 접속하는 경우, 사용자의 정보는 서비스 인프라가 위치한 대한민국 및 수탁업체의 본사가 위치한 미국으로 전송되어 저장됩니다. 사용자는 서비스 이용 시 이에 동의한 것으로 간주됩니다."
                    },
                    {
                        title: "보호 표준",
                        content: "본 서비스는 국가 간 데이터 이전 시 SSL/TLS 암호화 등 표준 보안 기술을 적용하여 데이터를 안전하게 보호합니다."
                    }
                ]
            },
            article5: {
                title: "제5조 (개인정보 보안 조치)",
                content: "본 서비스는 기술적으로 높은 수준의 보안을 유지하기 위해 다음과 같은 조치를 취하고 있습니다.",
                items: [
                    {
                        title: "비밀번호 암호화",
                        content: "사용자의 비밀번호는 글로벌 인증 표준인 AWS Cognito를 통해 일방향 암호화되어 저장됩니다. 운영자를 포함한 그 누구도 사용자의 비밀번호를 열람할 수 없습니다."
                    },
                    {
                        title: "데이터 전송 보호",
                        content: "모든 데이터 통신은 SSL/TLS 암호화(HTTPS)를 통해 보호됩니다."
                    },
                    {
                        title: "접속 기록 관리",
                        content: "IP 주소는 보안 목적으로만 최소 시간(10분) 동안 머무르며, 주기적인 자동화 스크립트를 통해 완전히 삭제됩니다."
                    }
                ]
            },
            article6: {
                title: "제6조 (정보주체의 권리 및 행사 방법)",
                content: "사용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 개인정보 이용 동의를 철회할 권리가 있습니다. 관련 요청은 서비스 내 '계정 설정' 또는 제8조의 문의처를 통해 진행하실 수 있습니다."
            },
            article7: {
                title: "제7조 (개인정보 보안 및 해킹 관련 면책)",
                items: [
                    {
                        title: "보안의 한계",
                        content: "운영자는 AWS 및 Vercel의 최신 보안 인프라를 활용하여 최선의 보호 조치를 다하지만, 인터넷 환경의 특성상 완벽한 보안을 보장할 수는 없습니다."
                    },
                    {
                        title: "면책 조항",
                        content: "제3자의 불법적인 침입(해킹)이나 예상치 못한 서버 장애로 인한 정보 유출 및 데이터 손실에 대하여 운영자의 중대한 과실이 없는 한 책임을 지지 않습니다."
                    },
                    {
                        title: "사용자 주의사항",
                        content: "사용자의 계정 정보 및 비밀번호 관리 소홀로 인해 발생하는 보안 사고의 책임은 사용자 본인에게 있습니다."
                    }
                ]
            },
            article8: {
                title: "제8조 (개인정보 보호 책임자 및 문의처)",
                content: "서비스 이용 중 발생하는 개인정보 관련 민원이나 문의사항은 아래 연락처로 접수해 주시기 바랍니다.",
                contact: {
                    name: "성명: Yejingram Realm 운영자",
                    email: "이메일: <1>support@yejingram.com</1>"
                }
            }
        }
    },
    tos: {
        title: "서비스 이용약관",
        subtitle: "Yejingram Realm",
        last_updated: "최종 업데이트: {{date}}",
        articles: {
            article1: {
                title: "제1조 (약관의 동의)",
                content: "Yejingram Realm(이하 \"본 서비스\")에 접속하고 이용함으로써, 귀하는 본 약관의 모든 조건에 동의하게 됩니다. 본 약관에 동의하지 않을 경우 서비스 이용이 제한될 수 있습니다."
            },
            article2: {
                title: "제2조 (서비스의 목적 및 중개자로서의 지위)",
                content: [
                    "본 서비스는 사용자가 캐릭터 및 관련 콘텐츠를 업로드하고 배포할 수 있는 기술적 인프라와 플랫폼을 제공합니다.",
                    "본 서비스는 단순 배포 서비스 제공자(Intermediary)로서의 역할만 수행하며, 사용자가 업로드하는 콘텐츠의 생성, 편집, 검수 과정에 관여하지 않습니다.",
                    "운영자는 사용자와 제3자 간의 콘텐츠 관련 거래나 분쟁에 개입하지 않으며, 이에 대해 어떠한 책임도 지지 않습니다."
                ]
            },
            article3: {
                title: "제3조 (사용자 책임 및 콘텐츠 소유권)",
                content: [
                    "사용자는 본인이 업로드한 콘텐츠에 대한 모든 법적 권한과 책임을 보유합니다.",
                    "콘텐츠를 업로드함으로써 귀하는 해당 콘텐츠가 제3자의 저작권, 상표권 등 지식재산권 및 기타 권리를 침해하지 않음을 보증합니다.",
                    "콘텐츠와 관련하여 발생하는 모든 민·형사상 책임은 전적으로 업로더에게 있으며, 본 서비스는 어떠한 경우에도 사용자가 유포한 정보로 인한 손해에 책임을 지지 않습니다."
                ]
            },
            article4: {
                title: "제4조 (콘텐츠 정책 및 운영자의 권한)",
                content: [
                    "운영자는 관련 법령 또는 본 약관을 위반하거나, 타인의 권리를 침해하는 것으로 판단되는 콘텐츠를 사전 통지 없이 즉시 삭제하거나 접근을 차단할 권리를 보유합니다.",
                    "운영자는 기술적 결함이나 신고 접수 시 해당 콘텐츠를 검토할 수 있으나, 모든 콘텐츠를 사전에 전수 검사할 의무는 없습니다."
                ]
            },
            article5: {
                title: "제5조 (데이터 보존 및 서비스 중단에 대한 면책)",
                subsections: [
                    {
                        title: "인프라 의존성",
                        content: "본 서비스는 Amazon Web Services(AWS) 및 Vercel 등 제3자 외부 인프라를 기반으로 운영됩니다."
                    },
                    {
                        title: "인프라 장애 면책",
                        content: "AWS 또는 Vercel의 서버 장애, 네트워크 지연, 리전 가동 중단(Outage) 등 운영자가 직접 제어할 수 없는 제3자의 서비스 결함으로 인해 발생하는 서비스 중단 및 데이터 접근 불가능 상황에 대하여 운영자는 어떠한 책임도 지지 않습니다."
                    },
                    {
                        title: "데이터 백업 의무",
                        content: "사용자는 본 서비스에 업로드한 파일 및 데이터의 원본을 스스로 백업할 책임이 있습니다. 인프라 장애로 인한 데이터의 유실, 손상에 대해 운영자는 복구 의무를 지지 않습니다."
                    },
                    {
                        title: "서비스 중단",
                        content: "운영자는 인프라 점검, 교체, 고장 등 운영상 필요한 경우 서비스의 전부 또는 일부를 일시적 혹은 영구적으로 중단할 수 있습니다."
                    }
                ]
            },
            article6: {
                title: "제6조 (개인정보 보안 및 해킹 관련 면책)",
                content: [
                    "운영자는 관계 법령이 정하는 바에 따라 사용자의 개인정보를 보호하기 위해 노력합니다.",
                    "인터넷 환경의 특성상 완벽한 보안을 보장할 수 없으므로, 운영자의 고의 또는 중대한 과실이 없는 한 제3자의 불법적인 접속(해킹)이나 보안 사고로 인한 정보 유출, 데이터 훼손에 대하여 운영자는 책임을 지지 않습니다.",
                    "사용자가 자신의 ID, 이메일, 비밀번호 등 계정 정보를 소홀히 관리하여 발생한 모든 보안 사고의 책임은 사용자 본인에게 있습니다."
                ]
            },
            article7: {
                title: "제7조 (책임의 부인 및 손해배상 제한)",
                subsections: [
                    {
                        title: "AS-IS 원칙",
                        content: "본 서비스는 '있는 그대로(As-Is)' 제공됩니다. 운영자는 서비스의 무중단 운영, 무결성, 또는 특정 목적 적합성에 대해 어떠한 명시적·묵시적 보증도 하지 않습니다."
                    },
                    {
                        title: "손해배상 범위 제한",
                        content: "운영자는 다음 각 호의 사유로 발생한 손해에 대해 책임을 지지 않습니다.",
                        list: [
                            "제3자 인프라 서비스(AWS, Vercel 등)의 장애 또는 중단",
                            "천재지변, 전쟁, 국가비상사태 등 불가항력적 사유",
                            "사용자의 귀책 사유로 인한 서비스 이용 장애 또는 데이터 유출",
                            "사용자가 업로드한 콘텐츠로 인해 발생한 제3자와의 분쟁"
                        ]
                    },
                    {
                        title: "배상 책임",
                        content: "사용자가 본 약관을 위반하여 운영자에게 손해가 발생할 경우, 사용자는 운영자의 법률 비용을 포함한 모든 손해를 배상해야 합니다."
                    }
                ]
            }
        },
        disclaimer: "Yejingram Realm은 오픈소스 프로젝트로 운영되며, AWS 및 Vercel의 인프라를 활용하는 Wrapper 서비스입니다. 운영자는 서비스의 지속성, 데이터의 무결성, 특정 시점의 가용성을 보장하지 않습니다."
    }
};
