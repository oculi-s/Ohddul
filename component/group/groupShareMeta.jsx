export const SubGraph = {
    삼성: {
        오너일가: ['이재용', '이부진', '이서현', '홍라희', '이유정'],
        재단: ['삼성생명공익재단', '삼성문화재단', '삼성복지재단', '삼성글로벌리서치'],
        전자전기: ['삼성전자', '삼성SDI', '삼성전기'],
        실질적지주사: ['삼성생명', '삼성물산'],
        금융: ['삼성화재', '삼성FN리츠', '삼성증권', '삼성카드'],
        중공업: ['삼성중공업', '삼성엔지니어링'],
        기타: ['에스원', '멀티캠퍼스', '제일기획', '호텔신라'],
        IT서비스: ['삼성에스디에스'],
        바이오: ['삼성바이오로직스'],
    },
    LG: {
        오너일가: {
            LG계: ['구본무', '김영식', '구광모', '구연경', '구본능'],
            LX계: ['구본준'],
            LT계: ['구본식'],
        },
        재단: ['LG연암문화재단', 'LG연암학원', 'LG복지재단', 'LG상록재단'],
        전자: ['LG전자', 'LG이노텍', 'LG디스플레이', '로보스타'],
        배터리화학: ['LG화학', 'LG에너지솔루션'],
        통신: ['LG유플러스', 'LG헬로비전'],
        생활용품: ['LG생활건강'],
        금융: ['HS애드'],
        // 외국자본: ['Silchester', 'T Rowe Price']
    },
    SK: {
        오너일가: {
            최종현계: ['최태원', '최기원',],
            최종건계: ['최창원', '최민근', '최영근',]
        },
        SK계: {
            _: ['SK', 'SK텔레콤', '에스엠코어', 'SK바이오팜', 'SK스퀘어', 'SK하이닉스', '나노엔텍', '드림어스컴퍼니', '인크로스'],
            배터리화학: ['SK이노베이션', 'SK IET', 'SKC'],
            렌트: ['SK네트웍스', 'SK렌터카'],
            리츠: ['SK리츠']
        },
        SK디스커버리계: {
            _: ['SK디스커버리', 'SK가스', 'SK디앤디'],
            화학: ['SK케미칼', 'SK바이오사이언스'],

        }
    },
    현대차: {
        오너일가: ['정몽구', '정의선', '정문선', '정일선', '정성이'],
        제철: ['현대제철', '현대비앤지스틸'],
        완성차: ['현대차', '기아'],
        부품: ['현대위아', '현대모비스'],
        기타: ['현대오토에버', '이노션',],
    },
    카카오: {
        오너일가: ['김범수', '케이큐브홀딩스'],
        금융: ['카카오페이', '카카오뱅크'],
        엔터테인먼트: ['에스엠', '키이스트', 'SM C&C', '디어유', 'SM Life Design', '카카오엔터테인먼트', 'SM엔터 JAPAN'],
        게임: ['카카오게임즈', '넵튠']
    },
    에코프로: {
        오너일가: ['이동채', '이선이']
    },
    HD현대: {
        오너일가: ['정몽준', '정기선'],
        재단: ['아산사회복지재단'],
        조선: ['HD한국조선해양', '현대미포조선', 'HD현대중공업'],
        전기장비: ['HD현대일렉트릭'],
        태양광: ['HD현대에너지솔루션'],
        건설: ['HD현대사이트솔루션', 'HD현대인프라코어', 'HD현대건설기계']
    },
    셀트리온: {
        오너일가: ['서정진'],
        '': ['셀트리온스킨큐어', '셀트리온', '셀트리온헬스케어', '셀트리온제약']
    },
    한화: {
        오너일가: ['김승연', '김동관', '김동선', '김동원'],
        우주항공해양: ['한화에어로스페이스', '한화오션', '한화시스템'],
        금융: ['한화생명', '한화리츠', '한화손해보험', '한화투자증권'],
        태양광: ['한화솔루션'],
        백화점: ['한화갤러리아']
    },
    두산: {
        오너일가: ['박용현', '박정원', '박지원', '박진원', '박용성'],
        재단: ['두산연강재단'],
        웨이퍼테스트: ['두산테스나'],
        건설기계: ['두산에너빌리티', '두산밥캣'],
        연료전지: ['두산퓨얼셀'],
        광고: ['오리콤']
    },
    롯데: {
        오너일가: ['신동빈', '신영자'],
        재단: ['롯데장학재단'],
        식품: ['롯데칠성', '롯데웰푸드'],
        배터리화학: ['롯데케미칼', '롯데정밀화학', '롯데에너지머티리얼즈'],
        쇼핑: ['롯데쇼핑', '롯데하이마트'],
        IT서비스: ['롯데정보통신']
    },
    한진: {
        오너일가: ['조현민', '조원태', '이명희', '그레이스홀딩스'],
        재단: ['정석인하학원',],
        항공사: {
            _: ['한진칼', '대한항공', '진에어', '한국공항'],
            물류: ['한진']
        }
    },
    CJ: {
        오너일가: ['이재현', '이경후', '이선호'],
        영화미디어: ['CJ ENM', '스튜디오드래곤', 'CJ CGV'],
        식품: ['CJ프레시웨이', 'CJ제일제당', 'CJ씨푸드'],
        물류: ['CJ대한통운'],
        바이오: ['CJ 바이오사이언스']
    },
    영풍: {
        오너일가: {
            장세준계: ['장세준', '장세환', '장형진'],
            최창규계: ['최창규', '최정운', '최윤범', '최창근', '최창영', '최정일']
        },
        비철금속: ['영풍', '고려아연'],
        PCB: ['코리아써키트', '인터플렉스']
    },
    KT: {
        미디어: ['KT시즌미디어', '지니뮤직', 'KT스튜디오지니', 'KT알파', '스카이라이프'],
        광고: ['플레이디', '나스미디어'],
        해저케이블: ['KT서브마린'],
        고객서비스: ['KTis', 'KTcs']
    },
    GS: {
        오너일가: {
            허정구계: ['허정구', '허남각', '허준홍', '허정윤', '허영자', '허동수', '허세홍', '허자홍', '허지영', '허광수', '허유정', '허서홍', '허영숙'],
            허학구계: ['허학구', '허전수', '허제홍', '허제현', '허자윤', '허명자', '허혜자', '허숙원'],
            허준구계: ['허준구', '허창수', '허윤영', '허윤홍', '허정수', '허철홍', '허두홍', '허진수', '허치홍', '허진홍', '허명수', '허주홍', '허태홍', '허태수', '허정현'],
            허신구계: ['허신구', '허경수', '허수연', '허지연', '허연수'],
            허완구계: ['허완구', '허용수', '허인영'],
            허승효계: ['허승효', '허영수', '허임수', '허윤수'],
            허승표계: ['허승표', '허서정', '허준수'],
            허승조계: ['허승조', '허지안', '허민경'],
        }
    },
    크래프톤: {
        오너일가: ['장병규']
    },
    DB: {
        오너일가: ['김준기', '김주원', '김남호'],
        재단: ['DB김준기재단'],
        금융: ['DB손해보험', 'DB금융투자'],
        반도체: ['DB하이텍']
    },
    아모레퍼시픽: {
        오너일가: ['서경배', '서민정'],
        재단: ['성환복지기금', '아모레퍼시픽재단']
    },
    넷마블: {
        오너일가: ['방준혁']
    },
    효성: {
        오너일가: ['조현준', '조석래', '조현상'],
        화학: ['효성화학', '효성첨단소재', '효성티앤씨'],
        IT서비스: ['효성 ITX', '갤럭시아머니트리'],
        스포츠마케팅: ['갤럭시아에스엠'],
        건설중공업: ['효성중공업', '진흥기업']
    },
    LS: {
        오너일가: {
            구태회계: ['구근희', '이미영', '이지현', '이재우', '구자홍', '구나윤', '구본응', '구혜정', '이대현', '이상현', '구자엽', '구은희', '정창현', '정진주', '정창민', '구본규', '구자명', '구본혁', '구윤희', '구자철', '구원희'],
            구평회계: ['구자열', '구은아', '구동휘', '구은성', '구자용', '구희나', '구희연', '구자균', '구소연', '구소희', '구혜원', '주신홍', '주은진', '주은혜'],
            구두회계: ['구은정', '김지선', '김국선', '김태익', '구지희', '구자은', '구원경', '구민기', '구재희']
        },
        전기케이블: ['가온전선', 'LS전선아시아', 'LS ELECTRIC', 'LS전선'],
        주유소: ['E1']
    },
    한국타이어: {
        오너일가: ['조현범', '조희원', '조현식', '조희경']
    },
    신세계: {
        오너일가: ['정용진', '이명희', '정유경'],
        정용진산하: ['이마트', '신세계푸드', '신세계건설', '신세계 I&C', '조선호텔앤리조트'],
        정유경산하: ['신세계', '신세계인터내셔날', '광주신세계']
    },
    현대백화점: {
        오너일가: ['정몽근', '정지선', '정교선'],
        정지선산하: ['현대백화점', '지누스', '현대홈쇼핑', '현대쇼핑', '한섬', '현대퓨처넷', '현대바이오랜드', '현대A&I'],
        정교선산하: ['현대그린푸드', '현대이지웰', '현대에버다임', '현대리바트']
    },
    다우키움: {
        오너일가: ['김동준', '김익래']
    },
    LX: {
        오너일가: ['구본준', '구형모', '구연제'],
        반도체: ['LX세미콘'],
        인테리어: ['LX하우시스'],
        무역: ['LX인터내셔널']
    },
    하림: {
        오너일가: {
            _: ['김홍국', '오수정'],
            김준영: ['한국바이오텍', '올품']
        },
        식료품: ['하림', '선진', '팜스코'],
        해운: ['팬오션']
    }
}