const officialAreas = [
  ['Advanced Communication & Networking',101],['AI Computing & System Integration Solution',29],['AI Computing & Tech',57],['Components & Advanced Power Tech',92],['Consumer Electronic Accessories',163],['ePaper Pavilion',41],['Gaming',28],['Industrial IoT & Embedded Systems',74],['InnoVEX',438],['Intelligent Business Solutions',48],['International Exhibitors Area',76],['Media',7],['Robotics',57],['Semiconductors & Hospitality Suites',8],['Smart Mobility and Drone Tech',26],['Storage & Management Solutions',56],['System Integration Solution',82],['TechXperience',96]
];

const roleRoutes = [
  {
    id:'sales', title:'業務開發路線', icon:'🤝', objective:'找可成交的企業名單、合作機會、研究報告需求與企業訂閱線索。',
    areas:['AI Computing & System Integration Solution','Advanced Communication & Networking','Industrial IoT & Embedded Systems','System Integration Solution','InnoVEX'],
    questions:['今年最想解決的客戶痛點是什麼？','目前主要客戶產業與地區？','是否需要市場研究、產業情報或競品資料？','是否有亞太/國際市場拓展需求？','會後可否安排 30 分鐘需求訪談？'],
    output:['Top 30 leads','合作優先級 A/B/C','企業訂閱與報告銷售機會','會後 follow-up email 清單']
  },
  {
    id:'marketing', title:'行銷內容路線', icon:'📣', objective:'找社群題材、EDM 主題、短影音切角、活動報導素材與品牌合作案例。',
    areas:['AI Computing & Tech','Robotics','TechXperience','ePaper Pavilion','Gaming','InnoVEX'],
    questions:['這個 demo 一句話怎麼說會吸引一般讀者？','有沒有可拍攝的視覺亮點？','產品背後的市場趨勢是什麼？','是否可提供受訪者、圖片或新聞稿？','哪個議題最適合 LinkedIn / X / FB？'],
    output:['每日主打貼文','3 支 Reels 腳本','展後 EDM 主題','圖文素材清單']
  },
  {
    id:'data-marketing', title:'數據營銷路線', icon:'📈', objective:'把觀展轉成可追蹤 funnel：內容曝光、名單蒐集、報告導購、訂閱轉換。',
    areas:['Media','AI Computing & Tech','InnoVEX','Intelligent Business Solutions','Advanced Communication & Networking'],
    questions:['哪些題目最容易帶來搜尋與社群互動？','這家公司適合對應哪個報告分類？','可以設計哪一種 CTA？','是否能取得白皮書或 demo 資料作為 lead magnet？','哪個 keyword 可延伸成 SEO / GEO FAQ？'],
    output:['UTM 命名規則','Lead scoring 欄位','內容 × 產品推薦表','GA4 / Piano 追蹤清單']
  },
  {
    id:'analyst', title:'產業分析師路線', icon:'🧠', objective:'捕捉產業訊號：技術成熟度、量產時程、供應鏈瓶頸、訂單能見度與競爭格局。',
    areas:['Semiconductors & Hospitality Suites','AI Computing & System Integration Solution','Components & Advanced Power Tech','Robotics','Storage & Management Solutions'],
    questions:['目前是 demo、PoC、design-in 還是量產？','量產瓶頸在哪：良率、成本、散熱、供電還是軟體？','主要客戶是哪一類？','下一代產品 road map 到哪個季度？','這項技術被高估或低估的地方？'],
    output:['展後產業短評','供應鏈地圖','技術成熟度評分','報告選題池']
  },
  {
    id:'government', title:'政府計畫/專案執行者路線', icon:'🏛️', objective:'尋找可對接政策、補助、產業輔導、場域驗證、國際合作與示範案的廠商。',
    areas:['Smart Mobility and Drone Tech','Robotics','Industrial IoT & Embedded Systems','TechXperience','InnoVEX','ePaper Pavilion'],
    questions:['是否有地方政府、園區或法人合作案例？','技術是否適合示範場域或補助計畫？','可量化的節能、減碳、人力節省或效率提升是多少？','是否有中小企業導入方案？','需要哪些政府資源協助國際化？'],
    output:['示範場域候選名單','補助計畫對接表','政策亮點案例','產業輔導提案素材']
  },
  {
    id:'product', title:'產品經理路線', icon:'🧩', objective:'判斷市場需求、產品包裝、功能差異化與可商業化的 roadmap。',
    areas:['AI Computing & Tech','Intelligent Business Solutions','Advanced Communication & Networking','InnoVEX','System Integration Solution'],
    questions:['客戶真正願意付費的功能是什麼？','這個產品和競品差異在哪？','導入門檻與使用流程有多高？','是否可包裝成報告/資料庫/訂閱服務？','下一個版本最重要的功能是什麼？'],
    output:['產品機會矩陣','功能優先級','包裝與定價假設','跨部門開發需求']
  },
  {
    id:'media', title:'媒體採訪路線', icon:'🗞️', objective:'快速找到值得採訪、值得做新聞、值得做圖解與深度報導的對象。',
    areas:['Media','AI Computing & Tech','Robotics','InnoVEX','Semiconductors & Hospitality Suites'],
    questions:['這項展示今年第一次出現嗎？','它和去年最大不同是什麼？','有沒有數字可以證明市場正在成長？','能否提供高層或技術主管受訪？','這個故事對國際讀者的意義是什麼？'],
    output:['採訪名單','新聞標題池','深度專題方向','圖解資料需求']
  }
];

const vendors = [
  {company:'NVIDIA', brand:'NVIDIA', area:'AI Computing & Tech', booth:'TICC / GTC Taipei', country:'United States', products:'AI accelerator, GPU, robotics, physical AI, data center platform', tags:['AI','GPU','DataCenter','Robotics','HPC'], roles:['sales','marketing','data-marketing','analyst','product','media']},
  {company:'Intel', brand:'Intel', area:'AI Computing & Tech', booth:'Nangang Hall 2 / TWTC robotics area', country:'United States', products:'AI PC, Foundry, Core Ultra, robotics edge AI', tags:['AI PC','Semiconductor','EdgeAI','Robotics'], roles:['sales','analyst','product','media']},
  {company:'Qualcomm', brand:'Snapdragon / Dragonwing', area:'AI Computing & Tech', booth:'Nangang Hall 2', country:'United States', products:'AI PC, Edge AI, agentic AI, industrial platform', tags:['EdgeAI','AI PC','AgenticAI'], roles:['marketing','analyst','product','media']},
  {company:'MediaTek', brand:'MediaTek', area:'AI Computing & Tech', booth:'Nangang', country:'Taiwan', products:'Dimensity, Kompanio, on-device generative AI, AI reader SoC', tags:['EdgeAI','LLM','AI PC','Semiconductor'], roles:['analyst','product','media','marketing']},
  {company:'Advantech Co., Ltd.', brand:'Advantech', area:'Advanced Communication & Networking', booth:'K0603a', country:'Taiwan', products:'Server, Industrial Computer, Image Recognition Service / Device', tags:['IIoT','EdgeAI','SmartManufacturing','DataCenter'], roles:['sales','government','analyst','product']},
  {company:'Wiwynn Corporation', brand:'Wiwynn', area:'AI Computing & System Integration Solution', booth:'Nangang', country:'Taiwan', products:'AI server, liquid cooling, CPO optical expansion, HVDC data center', tags:['DataCenter','LiquidCooling','HPC','CPO'], roles:['sales','analyst','product','media']},
  {company:'Foxconn', brand:'Hon Hai / Foxconn', area:'AI Computing & System Integration Solution', booth:'Nangang Hall 1', country:'Taiwan', products:'AI server, smart manufacturing, robotics, EV platform', tags:['AI Server','Robotics','EV','SmartManufacturing'], roles:['sales','analyst','government','media']},
  {company:'AMAX-KY', brand:'AMAX', area:'AI Computing & System Integration Solution', booth:'R0233a', country:'Taiwan', products:'Industrial control equipment, servers, CDU, liquid cooling data center platform, AI computing cluster', tags:['AI','HPC','LiquidCooling','ESG'], roles:['sales','analyst','government']},
  {company:'Accordance Systems Inc.', brand:'AiRPA / ARAID / PLC PLUS', area:'AI Computing & System Integration Solution', booth:'R0134', country:'Taiwan', products:'Automated & Industrial Controller Module', tags:['DataCenter','EdgeAI','Embedded','Robotics','Semiconductor'], roles:['sales','government','analyst','product']},
  {company:'AptObject Corporation', brand:'AptBee', area:'AI Computing & System Integration Solution', booth:'R0731', country:'Taiwan', products:'AI platform and system integration', tags:['AI Platform','Cloud','SI','SmartManufacturing'], roles:['sales','data-marketing','product']},
  {company:'Brinno Incorporated', brand:'Brinno', area:'AI Computing & System Integration Solution', booth:'R0732', country:'Taiwan', products:'Image Recognition Service / Device', tags:['AI','EdgeAI','Embedded','FPGA'], roles:['marketing','government','product']},
  {company:'C-Media Electronics Inc.', brand:'C-Media', area:'AI Computing & System Integration Solution', booth:'R0120', country:'Taiwan', products:'IC Design, Packaging & Foundry', tags:['Semiconductor','IC Design'], roles:['analyst','product']},
  {company:'ADDER TECHNOLOGY LTD', brand:'ADDER', area:'Advanced Communication & Networking', booth:'K0017', country:'United Kingdom', products:'Other Networking, Decoder & Encoder', tags:['Networking','DataCenter'], roles:['sales','analyst']},
  {company:'AIFA TECHNOLOGY CORP.', brand:'AIFA TECH', area:'Advanced Communication & Networking', booth:'J1233', country:'Taiwan', products:'Networking and control devices', tags:['IoT','Networking'], roles:['sales','government']},
  {company:'ATEN INTERNATIONAL CO., LTD', brand:'ATEN', area:'Advanced Communication & Networking', booth:'K0116', country:'Taiwan', products:'Other Networking', tags:['Networking','DataCenter','KVM'], roles:['sales','analyst']},
  {company:'Acon-Holding INC', brand:'ACON Group', area:'Advanced Communication & Networking', booth:'K0616', country:'Taiwan', products:'Network Antenna', tags:['AI','AutonomousVehicles','DataCenter','EV','LEO','Robotics'], roles:['sales','government','analyst']},
  {company:'AirLive Technology Corporation', brand:'AirLive', area:'Advanced Communication & Networking', booth:'K0932', country:'Taiwan', products:'Router, Gateway, Wireless AP / Bridge, Network Switch, IP Camera, Cloud Computing & IT Services', tags:['Cloud','Network','Security','SmartCity'], roles:['sales','government','data-marketing']},
  {company:'Amaryllo Inc.', brand:'AMARYLLO / myHPcloud / Soteria', area:'Advanced Communication & Networking', booth:'K0221a', country:'Taiwan', products:'Storage, IP Camera', tags:['AI Platform','AI Service','Cloud','DataCenter','EdgeAI','SI'], roles:['sales','government','marketing']},
  {company:'AsiaRF Co. Ltd.', brand:'AsiaRF', area:'Advanced Communication & Networking', booth:'K0013', country:'Taiwan', products:'Gateway, NIC, networking', tags:['WiFi','Networking','IoT'], roles:['sales','government']},
  {company:'NXP', brand:'NXP', area:'Robotics', booth:'Nangang Hall 2 keynote', country:'Netherlands', products:'Automotive AI MCU/MPU, edge controllers, robotics security', tags:['PhysicalAI','Automotive','EdgeAI','Robotics'], roles:['government','analyst','product','media']},
  {company:'Hiwin Technologies', brand:'HIWIN', area:'Robotics', booth:'TWTC Hall 1 robotics area', country:'Taiwan', products:'Robot arm, precision transmission components', tags:['Robotics','SmartManufacturing','MotionControl'], roles:['sales','government','analyst']},
  {company:'Solomon Technology', brand:'Solomon', area:'Robotics', booth:'TWTC Hall 1', country:'Taiwan', products:'3D AI vision, automation and robotics', tags:['Robotics','ComputerVision','AI'], roles:['government','analyst','marketing']},
  {company:'E Ink Holdings', brand:'E Ink', area:'ePaper Pavilion', booth:'TWTC Hall 1', country:'Taiwan', products:'Color ePaper signage, smart retail, medical display, low-power display', tags:['ePaper','ESG','SmartRetail','DigitalSignage'], roles:['marketing','government','product','media']},
  {company:'Marvell', brand:'Marvell', area:'Semiconductors & Hospitality Suites', booth:'Keynote / Nangang Hall 2', country:'United States', products:'Custom AI silicon, switching chip, CPO and data center interconnect', tags:['Semiconductor','CPO','DataCenter','HPC'], roles:['analyst','product','media']},
  {company:'Media Magic Co., Ltd.', brand:'Media Magic', area:'InnoVEX', booth:'InnoVEX', country:'Japan', products:'AI solution', tags:['AI','Startup'], roles:['marketing','data-marketing','government']},
  {company:'Pythia Biotech Ltd.', brand:'Pythia', area:'InnoVEX', booth:'AI X Innovation Pavilion', country:'Taiwan', products:'Healthcare & Biotech', tags:['Healthcare','AI','Startup'], roles:['government','analyst','media']},
  {company:'3drens', brand:'3drens', area:'InnoVEX', booth:'Plug and Play Taiwan', country:'Taiwan', products:'AI and mobility data platform', tags:['AI','Mobility','Startup'], roles:['sales','government','data-marketing']},
  {company:'Accucrazy', brand:'Accucrazy', area:'InnoVEX', booth:'NVIDIA Inception Startups', country:'Taiwan', products:'AI startup', tags:['AI','NVIDIA Inception','Startup'], roles:['marketing','analyst','government']},
  {company:'Ailytics', brand:'Ailytics', area:'InnoVEX', booth:'NVIDIA Inception Startups', country:'Singapore', products:'AI solution', tags:['AI','ComputerVision','Startup'], roles:['government','sales','analyst']},
  {company:'Alberta Taiwan Office', brand:'ATO', area:'InnoVEX', booth:'Canada Pavilion', country:'Canada', products:'Government & Association, AI', tags:['Government','AI','International'], roles:['government','sales','media']},
  {company:'Akeana', brand:'Akeana', area:'InnoVEX', booth:'Intralink Innovation Pavilion', country:'United States', products:'Semiconductor Application', tags:['Semiconductor','Startup','RISC-V'], roles:['analyst','product']}
];
