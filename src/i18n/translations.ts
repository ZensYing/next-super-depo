import { LanguageCode } from "@/lib/constants";

export type TranslationKey = keyof typeof translations.en;

export const translations = {
    en: {
        // Header - Top Bar
        phone: "+00xxxxxxxxxxxx",
        currency: "USD $",

        // Header - Navigation
        home: "Home",
        brand: "Brand",
        allVendors: "Super Depo",
        offers: "Offers",
        publicationHouse: "Publication House",
        vendorZone: "Depo Zone",
        becomeVendor: "Become a Depo",
        vendorLogin: "Depo Login",
        sellerGuidelines: "Seller Guidelines",
        flashSale: "Flash Sale",
        featuredDeals: "Featured Deals",
        clearance: "Clearance",
        deal: "Deal",
        type: "Type",
        retail: "Retail",
        wholesale: "Wholesale",

        // Header - Search & Cart
        searchPlaceholder: "Search for items...",
        myCart: "My cart",

        // Categories
        categories: "Categories",
        allCategories: "All Categories",
        electronics: "Electronics",
        fashion: "Fashion",
        homeGarden: "Home & Garden",
        sportsOutdoors: "Sports & Outdoors",
        mensFashion: "Men's Fashion",
        womensFashion: "Women's Fashion",
        kidsFashion: "Kid's Fashion",
        healthBeauty: "Health & Beauty",
        petSupplies: "Pet Supplies",
        homeKitchen: "Home & Kitchen",
        babyToddler: "Baby & Toddler",
        sportsOutdoor: "Sports & Outdoor",
        phoneGadgets: "Phone & Gadgets",
        electronicsGadgets: "Electronics & Gadgets",

        // Product
        addToCart: "Add to cart",
        buyNow: "Buy now",
        outOfStock: "Out of Stock",
        inStock: "In Stock",
        quantity: "Qty",
        price: "Price",
        description: "Description",
        reviews: "Reviews",
        specifications: "Specifications",
        color: "Color",
        totalPrice: "Total Price",
        orders: "Orders",
        wishListed: "Wish Listed",
        overview: "Overview",
        detailDescription: "Detail Description",
        productDescription: "Product Description",
        noReviews: "No reviews yet. Be the first to review this product!",

        // Product Detail - Delivery
        fastDelivery: "Fast Delivery all across the country",
        safePayment: "Safe Payment",
        returnPolicy: "7 Days Return Policy",
        authenticProducts: "100% Authentic Products",
        chatWithVendor: "Chat for this product",
        moreFromStore: "More From The Store",
        products: "Products",

        // Footer
        aboutUs: "About Us",
        contactUs: "Contact Us",
        privacyPolicy: "Privacy Policy",
        termsConditions: "Terms & Conditions",
        help: "Help",
        faq: "FAQ",
        shipping: "Shipping",
        returns: "Returns",
        quickLinks: "Quick Links",
        myAccount: "My Account",
        myProfile: "My Profile",
        orderHistory: "Order History",
        wishlist: "Wishlist",
        trackOrder: "Track Order",
        contactInfo: "Contact Info",
        subscribeNewsletter: "Subscribe to Our Newsletter",
        newsletterDesc: "Get updates on new products and exclusive offers!",
        enterEmail: "Enter your email",
        subscribe: "Subscribe",
        allRightsReserved: "All rights reserved",
        footerDescription: "Your one-stop destination for all your shopping needs. Quality products from trusted vendors.",

        // Common
        seeAll: "See All",
        viewMore: "View More",
        loading: "Loading...",
        error: "Error",
        noResults: "No results found",

        // Hero/Banner
        shopNow: "Shop Now",
        discoverDeals: "Discover Amazing Deals",

        // Depo
        vendors: "Depos",
        vendorProducts: "Depo Products",

        // Auth
        login: "Login",
        register: "Register",
        logout: "Logout",
        email: "Email",
        password: "Password",
        phoneNumber: "Phone Number",
        continueWithGoogle: "Continue with Google",
        forgotPassword: "Forgot Password?",
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: "Already have an account?",
        signIn: "Sign In",
        signUp: "Sign Up",
        or: "Or",

        // Page titles
        brandsPage: "Brands",
        dealsPage: "Deals & Offers",
        vendorsPage: "All Depos",
        productDetails: "Product Details",
        pageNotFound: "Page Not Found",

        // Flash Deal
        flashDeal: "FLASH DEAL",
        flashDealDesc: "Hurry Up! The offer is limited. Grab while it lasts",
        viewAll: "View All",
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",

        // Featured Products
        featuredProducts: "Featured Products",
        topRated: "Top Rated",
        bestSelling: "Best Selling",
        newArrivals: "New Arrivals",
        topSellers: "Top Depos",
        latestProducts: "Latest Products",
        dealOfTheDay: "Deal of the Day",

        // Depos Page
        allStores: "All Depos",
        findStoresDesc: "Find your desired depos and shop your favourite products",
        filterBy: "Filter By",
        searchStore: "Search Store",
        sortBy: "Sort By",
        default: "Default",
        highestRating: "Highest Rating",
        mostProducts: "Most Products",
        nameAZ: "Name A-Z",
        rating: "Rating",
        closedNow: "Closed Now",

        // Brands Page
        allBrands: "All Brands",
        exploreBrands: "Explore products from your favorite brands",

        // Deals Page
        discountedProducts: "🔥 Discounted Products",
        grabDeals: "Grab these amazing deals before they're gone!",
        endsIn: "Ends in",
        showingProducts: "Showing",
        filter: "Filter",
        sold: "Sold",
        available: "Available",

        // Vendor Detail
        joined: "Joined",
        follow: "Follow",
        share: "Share",
        searchInStore: "Search in Store",
        allProducts: "All Products",

        // Promo Banner
        bestPlatform: "Best Platform",
        bestDepo: "Best Depo",
        bestPrice: "Best Price",
        bestTeam: "Best Team",
        bestDelivery: "Best Delivery",
        promoTagline: "Cambodia's Best Online Shopping Platform",
        promoDiscount: "Shop Now • Up to 50% Off",
    },

    km: {
        // Header - Top Bar
        phone: "+00xxxxxxxxxxxx",
        currency: "USD $",

        // Header - Navigation
        home: "ទំព័រដើម",
        brand: "យីហោ",
        allVendors: "Super Depo",
        offers: "ការផ្តល់ជូន",
        publicationHouse: "ផ្ទះបោះពុម្ព",
        vendorZone: "តំបន់ដេប៉ូ",
        becomeVendor: "ក្លាយជាដេប៉ូ",
        vendorLogin: "ចូលគណនីដេប៉ូ",
        sellerGuidelines: "គោលការណ៍អ្នកលក់",
        flashSale: "លក់រហ័ស",
        featuredDeals: "ការផ្តល់ជូនពិសេស",
        clearance: "លក់សម្អាត",
        deal: "Deal",
        type: "ប្រភេទ",
        retail: "លក់រាយ",
        wholesale: "លក់ដុំ",

        // Header - Search & Cart
        searchPlaceholder: "ស្វែងរកទំនិញ...",
        myCart: "កន្ត្រកខ្ញុំ",

        // Categories
        categories: "ប្រភេទ",
        allCategories: "ប្រភេទទាំងអស់",
        electronics: "អេឡិចត្រូនិក",
        fashion: "ម៉ូដ",
        homeGarden: "ផ្ទះ និង សួន",
        sportsOutdoors: "កីឡា និង ក្រៅផ្ទះ",
        mensFashion: "ម៉ូដបុរស",
        womensFashion: "ម៉ូដស្ត្រី",
        kidsFashion: "ម៉ូដកុមារ",
        healthBeauty: "សុខភាព និង សម្រស់",
        petSupplies: "សម្ភារៈសត្វចិញ្ចឹម",
        homeKitchen: "ផ្ទះ និង ផ្ទះបាយ",
        babyToddler: "ទារក និង កុមារ",
        sportsOutdoor: "កីឡា និង ក្រៅផ្ទះ",
        phoneGadgets: "ទូរស័ព្ទ និង ឧបករណ៍",
        electronicsGadgets: "អេឡិចត្រូនិក និង ឧបករណ៍",

        // Product
        addToCart: "បន្ថែមទៅកន្ត្រក",
        buyNow: "ទិញឥឡូវ",
        outOfStock: "អស់ស្តុក",
        inStock: "មានស្តុក",
        quantity: "បរិមាណ",
        price: "តម្លៃ",
        description: "ការពិពណ៌នា",
        reviews: "ការវាយតម្លៃ",
        specifications: "លក្ខណៈបច្ចេកទេស",
        color: "ពណ៌",
        totalPrice: "តម្លៃសរុប",
        orders: "ការបញ្ជាទិញ",
        wishListed: "បានដាក់បញ្ជីចង់បាន",
        overview: "ទិដ្ឋភាពទូទៅ",
        detailDescription: "ការពិពណ៌នាលម្អិត",
        productDescription: "ការពិពណ៌នាផលិតផល",
        noReviews: "មិនទាន់មានការវាយតម្លៃទេ។ ក្លាយជាមនុស្សដំបូងក្នុងការវាយតម្លៃផលិតផលនេះ!",

        // Product Detail - Delivery
        fastDelivery: "ដឹកជញ្ជូនរហ័សទូទាំងប្រទេស",
        safePayment: "ការទូទាត់សុវត្ថិភាព",
        returnPolicy: "គោលការណ៍បង្វិលសង 7 ថ្ងៃ",
        authenticProducts: "ផលិតផលពិតប្រាកដ 100%",
        chatWithVendor: "ជជែកអំពីផលិតផលនេះ",
        moreFromStore: "បន្ថែមពីដេប៉ូ",
        products: "ផលិតផល",

        // Footer
        aboutUs: "អំពីយើង",
        contactUs: "ទំនាក់ទំនងយើង",
        privacyPolicy: "គោលការណ៍ឯកជនភាព",
        termsConditions: "លក្ខខណ្ឌ",
        help: "ជំនួយ",
        faq: "សំណួរញឹកញាប់",
        shipping: "ការដឹកជញ្ជូន",
        returns: "ការបង្វិលសង",
        quickLinks: "តំណភ្ជាប់រហ័ស",
        myAccount: "គណនីរបស់ខ្ញុំ",
        myProfile: "ប្រវត្តិរូបរបស់ខ្ញុំ",
        orderHistory: "ប្រវត្តិការបញ្ជាទិញ",
        wishlist: "បញ្ជីចង់បាន",
        trackOrder: "តាមដានការបញ្ជាទិញ",
        contactInfo: "ព័ត៌មានទំនាក់ទំនង",
        subscribeNewsletter: "ជាវព្រឹត្តិប័ត្រព័ត៌មានរបស់យើង",
        newsletterDesc: "ទទួលបានព័ត៌មានអំពីផលិតផលថ្មី និងការផ្តល់ជូនពិសេស!",
        enterEmail: "បញ្ចូលអ៊ីមែលរបស់អ្នក",
        subscribe: "ជាវ",
        allRightsReserved: "រក្សាសិទ្ធិគ្រប់យ៉ាង",
        footerDescription: "គោលដៅតែមួយរបស់អ្នកសម្រាប់តម្រូវការទិញទំនិញទាំងអស់។ ផលិតផលដែលមានគុណភាពពីអ្នកលក់ដែលអាចទុកចិត្តបាន។",

        // Common
        seeAll: "មើលទាំងអស់",
        viewMore: "មើលបន្ថែម",
        loading: "កំពុងផ្ទុក...",
        error: "កំហុស",
        noResults: "រកមិនឃើញលទ្ធផល",

        // Hero/Banner
        shopNow: "ទិញឥឡូវ",
        discoverDeals: "ស្វែងរកការផ្តល់ជូនអស្ចារ្យ",

        // Depo
        vendors: "ដេប៉ូ",
        vendorProducts: "ផលិតផលដេប៉ូ",

        // Auth
        login: "ចូល",
        register: "ចុះឈ្មោះ",
        logout: "ចាកចេញ",
        email: "អ៊ីមែល",
        password: "ពាក្យសម្ងាត់",
        phoneNumber: "លេខទូរស័ព្ទ",
        continueWithGoogle: "បន្តជាមួយ Google",
        forgotPassword: "ភ្លេចពាក្យសម្ងាត់?",
        dontHaveAccount: "មិនទាន់មានគណនី?",
        alreadyHaveAccount: "មានគណនីរួចហើយ?",
        signIn: "ចូល",
        signUp: "ចុះឈ្មោះ",
        or: "ឬ",

        // Page titles
        brandsPage: "យីហោ",
        dealsPage: "ការផ្តល់ជូន និង ប្រូម៉ូសិន",
        vendorsPage: "ដេប៉ូទាំងអស់",
        productDetails: "ព័ត៌មានលម្អិតផលិតផល",
        pageNotFound: "រកមិនឃើញទំព័រ",

        // Flash Deal
        flashDeal: "លក់រហ័ស",
        flashDealDesc: "រីករាយជាមួយ! ការផ្តល់ជូនមានកំណត់។ ទាន់ពេលដែលវានៅមាន",
        viewAll: "មើលទាំងអស់",
        days: "ថ្ងៃ",
        hours: "ម៉ោង",
        minutes: "នាទី",
        seconds: "វិនាទី",

        // Featured Products
        featuredProducts: "ផលិតផលពិសេស",
        topRated: "វាយតម្លៃខ្ពស់",
        bestSelling: "លក់ដាច់បំផុត",
        newArrivals: "មកដល់ថ្មី",
        topSellers: "ដេប៉ូល្អបំផុត",
        latestProducts: "ផលិតផលថ្មីបំផុត",
        dealOfTheDay: "ការផ្តល់ជូនប្រចាំថ្ងៃ",

        // Depos Page
        allStores: "ដេប៉ូទាំងអស់",
        findStoresDesc: "ស្វែងរកដេប៉ូដែលអ្នកចង់បាន និងទិញផលិតផលដែលអ្នកចូលចិត្ត",
        filterBy: "ត្រងដោយ",
        searchStore: "ស្វែងរកដេប៉ូ",
        sortBy: "តម្រៀបដោយ",
        default: "លំនាំដើម",
        highestRating: "វាយតម្លៃខ្ពស់បំផុត",
        mostProducts: "ផលិតផលច្រើនបំផុត",
        nameAZ: "ឈ្មោះ ក-អ",
        rating: "វាយតម្លៃ",
        closedNow: "បិទឥឡូវ",

        // Brands Page
        allBrands: "យីហោទាំងអស់",
        exploreBrands: "រកមើលផលិតផលពីយីហោដែលអ្នកចូលចិត្ត",

        // Deals Page
        discountedProducts: "🔥 ផលិតផលបញ្ចុះតម្លៃ",
        grabDeals: "ទាន់ចាប់យកការផ្តល់ជូនអស្ចារ្យទាំងនេះមុនពេលអស់!",
        endsIn: "បញ្ចប់ក្នុង",
        showingProducts: "កំពុងបង្ហាញ",
        filter: "ត្រង",
        sold: "បានលក់",
        available: "មាន",

        // Vendor Detail
        joined: "បានចូលរួម",
        follow: "តាមដាន",
        share: "ចែករំលែក",
        searchInStore: "ស្វែងរកក្នុងហាង",
        allProducts: "ផលិតផលទាំងអស់",

        // Promo Banner
        bestPlatform: "វេទិកាល្អបំផុត",
        bestDepo: "ដេប៉ូល្អបំផុត",
        bestPrice: "តម្លៃល្អបំផុត",
        bestTeam: "ក្រុមល្អបំផុត",
        bestDelivery: "ដឹកជញ្ជូនល្អបំផុត",
        promoTagline: "វេទិកាទិញទំនិញអនឡាញល្អបំផុតនៅកម្ពុជា",
        promoDiscount: "ទិញឥឡូវ • បញ្ចុះតម្លៃរហូតដល់ ៥០%",
    },

    zh: {
        // Header - Top Bar
        phone: "+00xxxxxxxxxxxx",
        currency: "USD $",

        // Header - Navigation
        home: "首页",
        brand: "品牌",
        allVendors: "Super Depo",
        offers: "优惠",
        publicationHouse: "出版社",
        vendorZone: "Depo专区",
        becomeVendor: "成为Depo",
        vendorLogin: "Depo登录",
        sellerGuidelines: "商家指南",
        flashSale: "限时抢购",
        featuredDeals: "精选优惠",
        clearance: "清仓特卖",
        deal: "优惠",
        type: "类型",
        retail: "零售",
        wholesale: "批发",

        // Header - Search & Cart
        searchPlaceholder: "搜索商品...",
        myCart: "我的购物车",

        // Categories
        categories: "分类",
        allCategories: "所有分类",
        electronics: "电子产品",
        fashion: "时尚",
        homeGarden: "家居与园艺",
        sportsOutdoors: "运动与户外",
        mensFashion: "男装",
        womensFashion: "女装",
        kidsFashion: "童装",
        healthBeauty: "健康与美容",
        petSupplies: "宠物用品",
        homeKitchen: "家居与厨房",
        babyToddler: "婴幼儿",
        sportsOutdoor: "运动与户外",
        phoneGadgets: "手机与配件",
        electronicsGadgets: "电子产品与配件",

        // Product
        addToCart: "加入购物车",
        buyNow: "立即购买",
        outOfStock: "缺货",
        inStock: "有货",
        quantity: "数量",
        price: "价格",
        description: "描述",
        reviews: "评论",
        specifications: "规格",
        color: "颜色",
        totalPrice: "总价",
        orders: "订单",
        wishListed: "已收藏",
        overview: "概述",
        detailDescription: "详细描述",
        productDescription: "产品描述",
        noReviews: "暂无评论。成为第一个评论此产品的人！",

        // Product Detail - Delivery
        fastDelivery: "全国快速配送",
        safePayment: "安全支付",
        returnPolicy: "7天退货政策",
        authenticProducts: "100%正品保证",
        chatWithVendor: "咨询此商品",
        moreFromStore: "Depo更多商品",
        products: "产品",

        // Footer
        aboutUs: "关于我们",
        contactUs: "联系我们",
        privacyPolicy: "隐私政策",
        termsConditions: "条款与条件",
        help: "帮助",
        faq: "常见问题",
        shipping: "配送",
        returns: "退换货",
        quickLinks: "快速链接",
        myAccount: "我的账户",
        myProfile: "我的资料",
        orderHistory: "订单历史",
        wishlist: "愿望清单",
        trackOrder: "追踪订单",
        contactInfo: "联系信息",
        subscribeNewsletter: "订阅我们的新闻通讯",
        newsletterDesc: "获取新产品和独家优惠的最新信息！",
        enterEmail: "输入您的邮箱",
        subscribe: "订阅",
        allRightsReserved: "版权所有",
        footerDescription: "您购物需求的一站式目的地。来自值得信赖的商家的优质产品。",

        // Common
        seeAll: "查看全部",
        viewMore: "查看更多",
        loading: "加载中...",
        error: "错误",
        noResults: "未找到结果",

        // Hero/Banner
        shopNow: "立即购买",
        discoverDeals: "发现超值优惠",

        // Depo
        vendors: "Depo",
        vendorProducts: "Depo产品",

        // Auth
        login: "登录",
        register: "注册",
        logout: "注销",
        email: "电子邮件",
        password: "密码",
        phoneNumber: "电话号码",
        continueWithGoogle: "使用 Google 继续",
        forgotPassword: "忘记密码？",
        dontHaveAccount: "还没有账号？",
        alreadyHaveAccount: "已有账号？",
        signIn: "登录",
        signUp: "注册",
        or: "或",

        // Page titles
        brandsPage: "品牌",
        dealsPage: "优惠与促销",
        vendorsPage: "所有Depo",
        productDetails: "产品详情",
        pageNotFound: "页面未找到",

        // Flash Deal
        flashDeal: "限时抢购",
        flashDealDesc: "快抢！优惠有限，抓紧时间",
        viewAll: "查看全部",
        days: "天",
        hours: "小时",
        minutes: "分钟",
        seconds: "秒",

        // Featured Products
        featuredProducts: "精选产品",
        topRated: "评分最高",
        bestSelling: "畅销商品",
        newArrivals: "新品上市",
        topSellers: "热门Depo",
        latestProducts: "最新产品",
        dealOfTheDay: "每日特惠",

        // Depos Page
        allStores: "所有Depo",
        findStoresDesc: "找到你想要的Depo，购买你喜欢的产品",
        filterBy: "筛选",
        searchStore: "搜索Depo",
        sortBy: "排序",
        default: "默认",
        highestRating: "评分最高",
        mostProducts: "产品最多",
        nameAZ: "名称 A-Z",
        rating: "评分",
        closedNow: "已关闭",

        // Brands Page
        allBrands: "所有品牌",
        exploreBrands: "探索你喜欢的品牌产品",

        // Deals Page
        discountedProducts: "🔥 折扣商品",
        grabDeals: "抓紧时间购买这些超值优惠！",
        endsIn: "结束于",
        showingProducts: "显示",
        filter: "筛选",
        sold: "已售",
        available: "可用",

        // Vendor Detail
        joined: "加入时间",
        follow: "关注",
        share: "分享",
        searchInStore: "店内搜索",
        allProducts: "所有产品",

        // Promo Banner
        bestPlatform: "最佳平台",
        bestDepo: "最佳Depo",
        bestPrice: "最优价格",
        bestTeam: "最佳团队",
        bestDelivery: "最佳配送",
        promoTagline: "柬埔寨最佳在线购物平台",
        promoDiscount: "立即购买 • 最高优惠50%",
    },
} as const;

export const getTranslation = (lang: LanguageCode, key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key;
};
