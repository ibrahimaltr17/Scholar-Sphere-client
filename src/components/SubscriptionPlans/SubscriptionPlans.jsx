import React from "react";
import { Star, Bell, Crown, CheckCircle } from "lucide-react";

const plans = [
    {
        name: "Basic",
        price: "৳0 / month",
        highlight: false,
        icon: <Star className="text-blue-500 w-10 h-10" />,
        features: [
            "Access to all scholarships",
            "Limited search filters",
            "View top universities",
        ],
        buttonText: "Current Plan",
        buttonStyle: "bg-gray-200 text-gray-700 cursor-not-allowed",
    },
    {
        name: "Pro",
        price: "৳299 / month",
        highlight: true,
        icon: <Bell className="text-pink-500 w-10 h-10" />,
        features: [
            "Personalized recommendations",
            "Save favorite scholarships",
            "Email alerts & reminders",
        ],
        buttonStyle:
            "bg-gradient-to-r from-pink-500 to-indigo-500 text-white hover:from-pink-600 hover:to-indigo-600 transition",
        buttonText: "Subscribe Now",
    },
    {
        name: "Elite",
        price: "৳599 / month",
        highlight: false,
        icon: <Crown className="text-yellow-500 w-10 h-10" />,
        features: [
            "All Pro features",
            "Early access to scholarships",
            "1:1 counselor support",
        ],
        buttonStyle:
            "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition",
        buttonText: "Upgrade Now",
    },
];

const SubscriptionPlans = () => {
    return (
        <section className=" py-16 px-6 md:px-12 lg:px-20 transition-colors duration-500">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                    Unlock Premium Features
                </h2>
                <p className="text-base-content/70 max-w-2xl mx-auto">
                    Get personalized scholarship alerts, early access, and dedicated
                    application tracking. Choose the best plan that fits your journey.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`rounded-3xl shadow-lg p-8 text-center transition-transform transform hover:scale-105 ${plan.highlight
                                ? "bg-base-100 dark:bg-base-200 border-4 border-primary"
                                : "bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-400"
                            }`}
                    >
                        <div className="flex justify-center mb-6">{plan.icon}</div>
                        <h3 className="text-2xl font-semibold text-base-content mb-2">
                            {plan.name}
                        </h3>
                        <p className="text-lg font-medium text-base-content/70 mb-4">
                            {plan.price}
                        </p>

                        <ul className="space-y-2 mb-6 text-base-content/70 text-sm text-left inline-block">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <CheckCircle className="text-green-500 w-4 h-4" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`px-6 py-2 rounded-full font-medium ${plan.buttonStyle}`}
                        >
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SubscriptionPlans;
