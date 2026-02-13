
export const MESSAGES = {

    SUCCESS: "Operation completed successfully",
    SAVED: "Saved successfully",
    UPDATED: "Updated successfully",
    DELETED: "Deleted successfully",


    BAD_REQUEST: "Invalid request. Please check your input.",
    FORBIDDEN: "You do not have permission to access this resource.",
    NOT_FOUND: "The requested resource was not found.",
    CONFLICT: "A conflict occurred with the current state of the resource.",
    SERVER_ERROR: "An unexpected error occurred. Please try again later.",
    SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
    NETWORK_ERROR: "Network error. Please check your connection.",
    NO_SESSION: "No active session found",
    SESSION_EXPIRED: "Your session has expired. Please login again",
    INVALID_CREDENTIALS: "Invalid email or password.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    NO_DATA_FOUND: "No data found",
    MISSING_FIELDS:"Please fill all the required fields.",


    OTP_SENT: "OTP has been sent successfully.",
    OTP_RESENT: "OTP has been resent successfully.",
    OTP_VERIFIED: "OTP verified successfully.",
    OTP_EXPIRED: "OTP has expired. Please request a new one.",
    INVALID_OTP: "The OTP entered is invalid.",
    OTP_NOT_SENT:"Otp not sent.",


    LOGIN_SUCCESS: "Login successful.",
    LOGOUT_SUCCESS: "Logout successful.",
    USE_GOOGLE_SIGNIN_MESSAGE: "This account was created with Google. Please continue using Google Sign-In.",
    BLOCKED: "Your account has been blocked.",
    
    SIGNUP_TIMEOUT: "Process time-out. Please signup again",
    NO_ACCOUNT: "No account found with this email",
    INCORRECT_PASSWORD: "Password is incorrect",
    ACCOUNT_CREATED_SUCCESS : "Your account has been created successfully. You can now log in.",
    SIGNUP_FAILED: "Signup failed",



    LEARNER_UPDATED: "Learner details updated successfully.",
    LEARNER_DELETED: "Learner account deleted successfully.",
    LEARNERS_FETCHED: "Learners fetched successfully",
    LEARNER_NOT_CREATED: "Learner account creation failed. Please try again.",
    LEARNER_NOT_FOUND: "Learner not found",
    LEARNER_NOT_UPDATED: "Failed to update learner details. Please try again",

    INSTRUCTOR_UPDATED: "Instructor details updated successfully.",
    INSTRUCTOR_DELETED: "Instructor account deleted successfully.",
    INSTRUCTOR_FETCHED: "Instructor fetched successfully",
    INSTRUCTOR_NOT_CREATED: "Instructor account creation failed. Please try again.",
    INSTRUCTOR_NOT_FOUND: "Instructor not found.",
    INSTRUCTOR_NOT_VERIFIED: "Instructor must be verified to perform this action.",
    INSTRUCTOR_NOT_UPDATED: "Failed to update instructor details. Please try again",
    SEND_VERIFICATION_SUCCESS: "Verification request submitted successfully.",
    INCOMPLETE_PROFILE: "Cannot apply for verification. Please complete your profile before submitting.",

    BUSINESS_UPDATED: "Business details updated successfully.",
    BUSINESS_DELETED: "Business account deleted successfully.",
    BUSINESS_FETCHED: "Business fetched successfully",
    BUSINESS_NOT_CREATED: "Business account creation failed. Please try again.",
    BUSINESS_NOT_FOUND: "Business not found",
    NOT_COMPANY_EMAIL: "Please use the company email",
    BUSINESS_NOT_UPDATED: "Failed to update business details. Please try again",


    EMAIL_EXISTS: "Email already exists",


    INVALID_TOKEN: "Invalid or expired token",
    INVALID_REFRESH_TOKEN: "The refresh token is invalid or expired.",
    NO_REFRESH_TOKEN: "Refresh token is missing",
    REFRESH_TOKEN_SUCCESS: "Access token was updated successfully.",
    ACCESS_TOKEN_NOT_CREATED:"Failed to create access token.",
    REFRESH_TOKEN_NOT_CREATED:"Failed to create refresh token.",



    COURSE_NOT_FOUND:"Course not found.",


    CATEGORY_EXISTS:"Category name already exists",
    CATEGORY_NOT_FOUND:"Category not found.",


    COUPON_EXISTS:"Coupon already exists",
    COUPON_EXPIRY_INVALID:"Coupon expiry date must be a future date",
    COUPON_MIN_COST_INVALID:"Minimum cost must be greater that discount amount.",
    COUPON_NOT_FOUND:"Coupon not found.",


    PROGRESS_NOT_FOUND:"Learner progress not found.",


    QUIZ_NOT_FOUND:"Quiz not found.",
    QUIZ_NOT_ACCESSIBLE:"Finish all chapters to access the final quiz.",


    ENROLLMENT_NOT_FOUND:"Enrollment not found.",


    PAYMENT_NOT_FOUND:'Payment not found',
    INVALID_PAYMENT_ID:"Invalid payment session ID.",


    INSTRUCTOR_WALLET_NOT_FOUND:"Instructor wallet not found.",


    LIVE_SESSION_NOT_FOUND:"Live session not found.",


    CONVERSATION_NOT_FOUND:"Conversation not found.",




} as const;

export type Message = typeof MESSAGES[keyof typeof MESSAGES];
