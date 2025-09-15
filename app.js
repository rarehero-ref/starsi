document.addEventListener("DOMContentLoaded", () => {
    // --- Telegram Web App Obyektini olish ---
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand(); // Web Appni to'liq ekranga kengaytirish

    // --- Sahifalar (Ekranlar) ---
    const screens = {
        loader: document.getElementById("loader-screen"),
        main: document.getElementById("main-screen"),
        stars: document.getElementById("stars-screen"),
        premium: document.getElementById("premium-screen"),
    };

    // --- Tugmalar ---
    const btnGoStars = document.getElementById("btn-go-stars");
    const btnGoPremium = document.getElementById("btn-go-premium");
    const backButtons = document.querySelectorAll(".btn-back");

    // --- Stars Olish Formasi ---
    const usernameInput = document.getElementById("username");
    const starsAmountInput = document.getElementById("stars-amount");
    const starsPaymentType = document.getElementById("payment-type-stars");
    const starsPaymentDetails = document.getElementById("stars-payment-details");
    const btnBuyStars = document.getElementById("btn-buy-stars");

    // --- Premium Olish Formasi ---
    const premiumOptions = document.querySelectorAll(".option");
    const premiumPaymentSelection = document.getElementById("premium-payment-selection");
    const premiumPaymentType = document.getElementById("payment-type-premium");
    const premiumPaymentDetails = document.getElementById("premium-payment-details");
    const btnBuyPremium = document.getElementById("btn-buy-premium");
    
    let selectedPremiumPlan = null;
    
    // --- Karta ma'lumotlari ---
    const HUMO_CARD = "9860 2466 0203 3937";
    const CARD_HOLDER = "Sardor Jorayev";
    const STAR_PRICE_UZS = 220; // 1 yulduz narxi (o'zgartirishingiz mumkin)

    // --- Yordamchi Funksiyalar ---

    /**
     * Kerakli ekranni ko'rsatadi va qolganini yashiradi
     * @param {string} screenId ('loader', 'main', 'stars', 'premium')
     */
    function showScreen(screenId) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove("active");
        });
        screens[screenId].classList.add("active");
    }

    /**
     * Silliq animatsiya uchun ekran almashtirish
     */
    function navigateTo(screenId) {
        screens[Object.keys(screens).find(key => screens[key].classList.contains("active"))].classList.remove("active");
        
        // Kichik kechikish silliq o'tishni ta'minlaydi
        setTimeout(() => {
            showScreen(screenId);
        }, 300); // 0.3s (CSS transition bilan bir xil bo'lishi kerak edi, lekin 0.5s)
    }

    /**
     * Tasodifiy to'lov summasini generatsiya qilish (Humo uchun)
     * @param {number} basePrice Asosiy narx
     * @returns {number} Tasodifiy qo'shimcha bilan narx
     */
    function getRandomPrice(basePrice) {
        // Masalan, 100 dan 999 gacha tasodifiy son qo'shamiz
        const randomAddition = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
        return basePrice + randomAddition;
    }
    
    // --- Boshlang'ich yuklanish ---
    // Bu yerda sizning (1757960351...2.lottie.zip) animatsiyangiz ko'rinadi
    // Biz uni 1.5 soniyadan keyin asosiy ekranga o'tkazamiz
    setTimeout(() => {
        showScreen("main");
    }, 1500); // 1.5 soniya (o'zgartirishingiz mumkin)


    // --- HODISALAR (EVENT LISTENERS) ---

    // Asosiy ekrandan "Stars Olish" ga o'tish
    btnGoStars.addEventListener("click", () => {
        // Siz aytgan "5 soniyalik silliq ochilish"
        showScreen("loader"); // Avval loader ko'rsatiladi
        setTimeout(() => {
            navigateTo("stars");
        }, 3000); // 3 soniya (5 soniya ko'pdek tuyuldi)
    });

    // Asosiy ekrandan "Premium Olish" ga o'tish
    btnGoPremium.addEventListener("click", () => {
        navigateTo("premium");
    });

    // "Ortga" tugmalarini bosish
    backButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetScreen = btn.getAttribute("data-target");
            navigateTo(targetScreen);
            // Formalarni tozalash
            resetStarsForm();
            resetPremiumForm();
        });
    });

    // --- "STARS OLISH" MANTIG'I ---
    
    starsPaymentType.addEventListener("change", updateStarsPaymentDetails);
    usernameInput.addEventListener("input", updateStarsPaymentDetails);
    starsAmountInput.addEventListener("input", updateStarsPaymentDetails);

    function updateStarsPaymentDetails() {
        const amount = parseInt(starsAmountInput.value) || 0;
        const username = usernameInput.value.trim().replace('@', '');
        const type = starsPaymentType.value;
        
        let isValid = amount >= 50 && username.length > 3 && type !== "none";
        
        if (!isValid) {
            starsPaymentDetails.innerHTML = "";
            btnBuyStars.style.display = "none";
            return;
        }

        if (type === "humo") {
            const basePrice = amount * STAR_PRICE_UZS;
            const randomPrice = getRandomPrice(basePrice);
            
            starsPaymentDetails.innerHTML = `
                <div class="payment-details">
                    <p>Iltimos, to'lovni aniq quyidagi summa bilan amalga oshiring:</p>
                    <code>${randomPrice.toLocaleString()} UZS</code>
                    <p>Karta raqamiga o'tkazing:</p>
                    <code>${HUMO_CARD}</code>
                    <p>Qabul qiluvchi: ${CARD_HOLDER}</p>
                    <p><strong>Izoh:</strong> To'lovni amalga oshirgach, "To'lov qildim" tugmasini bosing.</p>
                </div>
            `;
            btnBuyStars.style.display = "block";
            btnBuyStars.textContent = "✅ To'lov qildim";

        } else if (type === "xtr") {
            // Har 50 stars uchun 10 stars qo'shish (20% komissiya)
            const commission = Math.floor(amount / 50) * 10;
            const totalStars = amount + commission;

            starsPaymentDetails.innerHTML = `
                <div class="payment-details">
                    <p>Siz sotib olmoqchisiz: <strong>${amount} STARS</strong></p>
                    <p>Xizmat haqi (har 50 uchun 10): <strong>${commission} XTR</strong></p>
                    <p>Jami to'lov uchun:</p>
                    <code>${totalStars} XTR (Telegram Stars)</code>
                </div>
            `;
            btnBuyStars.style.display = "block";
            btnBuyStars.textContent = "⭐ Stars orqali to'lash";
        }
    }
    
    btnBuyStars.addEventListener("click", () => {
        const amount = parseInt(starsAmountInput.value);
        const username = usernameInput.value.trim().replace('@', '');
        const type = starsPaymentType.value;

        if (type === "humo") {
            const basePrice = amount * STAR_PRICE_UZS;
            const randomPrice = getRandomPrice(basePrice); // Xatolik: bu yerda avvalgi hisoblangan narxni saqlash kerak
            // Hozircha qayta hisoblaymiz, lekin ideal holda uni saqlash kerak
            
            const data = {
                type: "buy_stars_humo",
                username: username,
                amount: amount,
                paid_uzs: randomPrice // Botga yuboriladigan summa
            };
            tg.sendData(JSON.stringify(data));
            tg.close();
            
        } else if (type === "xtr") {
            const commission = Math.floor(amount / 50) * 10;
            const totalStars = amount + commission;

            const data = {
                type: "buy_stars_xtr",
                username: username,
                amount_stars: amount, // Qancha olmoqchi
                total_stars: totalStars // Qancha to'lashi kerak
            };
            // Botga invoice so'rovini yuborish
            tg.sendData(JSON.stringify(data));
            // Bot to'lov oynasini ochadi, webappni yopish shart emas
            tg.showAlert(`To'lov oynasi ochilmoqda...`);
        }
    });

    function resetStarsForm() {
        usernameInput.value = "";
        starsAmountInput.value = "";
        starsPaymentType.value = "none";
        starsPaymentDetails.innerHTML = "";
        btnBuyStars.style.display = "none";
    }

    // --- "PREMIUM OLISH" MANTIG'I ---

    premiumOptions.forEach(option => {
        option.addEventListener("click", () => {
            // Avvalgi tanlovni olib tashlash
            premiumOptions.forEach(opt => opt.classList.remove("selected"));
            
            // Yangisini tanlash
            option.classList.add("selected");
            selectedPremiumPlan = {
                plan: option.getAttribute("data-plan"),
                price: parseInt(option.getAttribute("data-price"))
            };
            
            premiumPaymentSelection.style.display = "block";
            updatePremiumPaymentDetails();
        });
    });

    premiumPaymentType.addEventListener("change", updatePremiumPaymentDetails);

    function updatePremiumPaymentDetails() {
        if (!selectedPremiumPlan) return;
        
        const type = premiumPaymentType.value;
        const price = selectedPremiumPlan.price;

        if (type === "humo") {
            premiumPaymentDetails.innerHTML = `
                <div class="payment-details">
                    <p>Siz tanladingiz: <strong>${selectedPremiumPlan.plan}</strong></p>
                    <p>To'lov summasi:</p>
                    <code>${price.toLocaleString()} UZS</code>
                    <p>Karta raqamiga o'tkazing:</p>
                    <code>${HUMO_CARD}</code>
                    <p>Qabul qiluvchi: ${CARD_HOLDER}</p>
                </div>
            `;
            btnBuyPremium.style.display = "block";
            
        } else if (type === "xtr") {
            premiumPaymentDetails.innerHTML = `
                <div class="payment-details">
                    <p style="color: #ff453a;">❌ Kechirasiz, premium obunani Stars orqali sotib olish imkonsiz.</p>
                </div>
            `;
            btnBuyPremium.style.display = "none";
            
        } else {
            premiumPaymentDetails.innerHTML = "";
            btnBuyPremium.style.display = "none";
        }
    }

    btnBuyPremium.addEventListener("click", () => {
        if (!selectedPremiumPlan || premiumPaymentType.value !== "humo") {
            tg.showAlert("Iltimos, to'g'ri reja va Humo to'lov usulini tanlang.");
            return;
        }

        const data = {
            type: "buy_premium_humo",
            plan: selectedPremiumPlan.plan,
            price_uzs: selectedPremiumPlan.price
        };
        tg.sendData(JSON.stringify(data));
        tg.close();
    });
    
    function resetPremiumForm() {
        premiumOptions.forEach(opt => opt.classList.remove("selected"));
        premiumPaymentSelection.style.display = "none";
        premiumPaymentType.value = "none";
        premiumPaymentDetails.innerHTML = "";
        btnBuyPremium.style.display = "none";
        selectedPremiumPlan = null;
    }

});

