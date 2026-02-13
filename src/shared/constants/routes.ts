
export const ROUTES = {
    AUTH:"/auth",
    LEARNER:"/learner",
    INSTRUCTOR:"/instructor",
    BUSINESS:"/business",
    ADMIN:"/admin",
    S3:"/s3",
    SIGNUP: "/signup",
    SEND_OTP:"/otp/send",
    RESEND_OPT:"/otp/resend",
    SIGNIN: "/signin",
    GOOGLE_AUTH:"/google",
    RESET_EMAIL_VERIFICATION:"/reset/email",
    RESET_OTP_VERIFICATION:"/reset/otp",
    RESET_PASSWORD:"/reset",
    LOGOUT: "/logout",
    PROFILE: "/profile",
    IMAGE:"/profile/image",
    EXPERTISE:"/profile/expertise",
    RESUME:"/profile/resume",
    ID_PROOF:"/profile/identity-proof",
    LICENSE:"/profile/license",
    PASSWORD:"/password",
    VERIFICATION:"/verification",
    
    INSTRUCTORS: "/instructors",
    LEARNERS: "/learners",
    BUSINESSES:"/businesses",
    LEARNER_STATUS:"/learner/status",
    INSTRUCTOR_STATUS:"/instructor/status",
    BUSINESS_STATUS:"/business/status",
    INSTRUCTOR_VERIFICATION:"/instructor/verification",
    BUSINESS_VERIFICATION:"/business/verification",
    REFRESH:"/refresh",
    LEARNER_DATA:"/learner/:id",
    INSTRUCTOR_DATA:"/instructor/:id",
    BUSINESS_DATA:"/business/:id",

    CATEGORY:"/category",
    CATEGORIES:"/categories",
    CATEGORY_STATUS:"/category/status",

    COUPON:"/coupon",
    COUPONS:"/coupons",
    COUPON_STATUS:"/coupon/status",

    COURSE:"/course",
    COURSES:"/courses",
    COURSE_INFO:"/course/info",
    COURSE_THUMBNAIL:"/course/thumbnail",
    COURSE_PREVIEW_VIDEO:"/course/preview-video",
    COURSE_PREVIEW:"/course/preview",
    COURSE_OBJECTIVES:"/course/objectives",
    COURSE_TAGS:"/course/tags",
    COURSE_PREREQUISITES:"/course/prerequisites",
    COURSE_VERIFICATION:"/course/verification",
    COURSE_STATUS:"/course/status",
    ADD_MODULE:"/course/module/add",
    ADD_CHAPTER:"/course/chapter/add",
    UPDATE_MODULE:"/course/module/update",
    UPDATE_CHAPTER:"/course/chapter/update",
    UPDATE_VIDEO:"/course/chapter/update",
    DELETE_MODULE:"/course/module/delete",
    DELETE_CHAPTER:"/course/chapter/delete",
    COURSE_OPTIONS:"/course/options",
    COURSE_QUIZ:"/course/quiz",
    LEARN_COURSE:"/course/learn",
    CHECKOUT:"/course/checkout",
    COURSE_VIDEO_STREAM:"/courses/:courseId/modules/:moduleId/chapters/:chapterId/stream",
    POPULAR_COURSES:"/courses/popular",
    COURSE_ANALYTICS:"/course/analytics",


    PROGRESS_CHAPTER_COMPLETE:"/progress/chapter/complete",
    PROGRESS_CHAPTER_CURRENT:"/progress/chapter/current",

    COURSE_REVIEW:"/course/review",
    COURSE_REVIEWS:"/course/reviews",
    REVIEW:"/review",


    SESSION:"/session",
    SESSIONS:"/sessions",
    START_SESSION:"/session/start",
    END_SESSION:"/session/end",
    JOIN_SESSION:"/session/join",
    CANCEL_SESSION:"/session/cancel",

    CONVERSATIONS:"/conversations",

    CERTIFICATES:"/certificates",

    MESSAGES:"/messages",
    DELETE_MESSAGE:"/messages/delete",


    DASHBOARD:"/dashboard",

    EARNINGS:"/earnings",

    ENROLLMENTS:"/enrollments",
    CANCEL_ENROLLMENT:"/enrollment/cancel",

    FAVOURITES:"/favourites",
    FAVOURITE_COURSE:"/favourites/:courseId",

    HOME:"/home",
    HOME_LEARNER_DATA:"/home/learner-data",

    INITIATE:"/initiate",
    
    PAYMENT:"/payment",

    PING:"/ping",

    QUIZ:"/quiz",
    COURSE_QUIZ_QUESTION:"/course/quiz/question",

    DELETE_RESOURCE:"/course/resource/delete",
    ADD_RESOURCE:"/course/resource/add",

    TOKEN:"/token",

    VIDEO:"/video",

    VERIFY:"/verify",

    WALLET:"/wallet"



} as const;
