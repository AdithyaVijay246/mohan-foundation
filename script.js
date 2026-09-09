/**
 * UI Controls and Staggered View Transition Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const fadingElements = document.querySelectorAll('.fade-prep');
    const swingingElements = document.querySelectorAll('.swing-prep');

    const transitionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                transitionObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.01, 
        rootMargin: '0px 0px -5px 0px' 
    });

    fadingElements.forEach((element, iterationIndex) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight) {
            setTimeout(() => {
                element.classList.add('reveal');
            }, iterationIndex * 80);
            transitionObserver.observe(element);
        } else {
            transitionObserver.observe(element);
        }
    });

    const swingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('swing-reveal');
                swingObserver.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });

    swingingElements.forEach(element => swingObserver.observe(element));

    // Hero Carousel Logic
    const heroCarouselInner = document.getElementById('hero-carousel-inner');
    const heroContainer = document.getElementById('hero-carousel-container');
    
    if (heroCarouselInner) {
        const slides = heroCarouselInner.children;
        const totalSlides = slides.length;
        let currentSlide = 0;
        let slideInterval;

        const updateCarousel = () => {
            heroCarouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        };

        if (heroContainer) heroContainer.addEventListener('click', () => { nextSlide(); resetInterval(); });

        const resetInterval = () => { clearInterval(slideInterval); slideInterval = setInterval(nextSlide, 6000); };
        slideInterval = setInterval(nextSlide, 6000); // Auto-play every 6 seconds
    }

    // Star Ambassadors Slider Logic
    const starSlider = document.getElementById('star-slider');
    const starPrev = document.getElementById('star-prev');
    const starNext = document.getElementById('star-next');

    if (starSlider && starPrev && starNext) {
        let starSliderInterval;

        const updateNavButtons = () => {
            // Disable prev button if at the start
            starPrev.disabled = starSlider.scrollLeft < 10;
            // Disable next button if at the end
            starNext.disabled = starSlider.scrollLeft + starSlider.clientWidth >= starSlider.scrollWidth - 10;
        };

        const scrollToNext = () => {
            // If at the end, scroll back to the beginning
            if (starSlider.scrollLeft + starSlider.clientWidth >= starSlider.scrollWidth - 10) {
                starSlider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                starSlider.scrollBy({ left: starSlider.clientWidth, behavior: 'smooth' });
            }
        };

        const scrollToPrev = () => {
            starSlider.scrollBy({ left: -starSlider.clientWidth, behavior: 'smooth' });
        };

        // Listen for scroll events on the slider to update buttons
        starSlider.addEventListener('scroll', updateNavButtons);

        const startAutoScroll = () => {
            starSliderInterval = setInterval(scrollToNext, 5000); // Scroll every 5 seconds
        };

        const stopAutoScroll = () => {
            clearInterval(starSliderInterval);
        };

        starNext.addEventListener('click', () => { stopAutoScroll(); scrollToNext(); });
        starPrev.addEventListener('click', () => { stopAutoScroll(); scrollToPrev(); });

        // Pause on hover
        starSlider.addEventListener('mouseenter', stopAutoScroll);
        starSlider.addEventListener('mouseleave', startAutoScroll);

        // Initial button state check
        updateNavButtons();
        startAutoScroll(); // Start the auto-scroll on page load
    }

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNavContainer = document.getElementById('main-nav-container');
    if (mobileMenuButton && mainNavContainer) {
        mobileMenuButton.addEventListener('click', () => {
            mainNavContainer.classList.toggle('hidden');
            mainNavContainer.classList.toggle('block');
        });
    }

    // Setup feedback section
    if (document.getElementById('feedback-container')) {
        setupFeedback();
    }

    // Setup stories section
    if (document.getElementById('stories-container')) {
        setupStories();
    }

    // Ambassador Login Form Logic
    const loginForm = document.getElementById('ambassador-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the form from submitting traditionally
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('login-error');

            // --- Placeholder Authentication ---
            // In a real application, you would send these credentials to a server.
            // For this demo, we'll use a simple hardcoded check.
            if (username === 'test@gmail.com' && password === 'test') {
                errorDiv.classList.add('hidden');
                // On successful login, redirect to the specified Google Drive link.
                window.location.href = 'https://drive.google.com'; 
            } else {
                errorDiv.classList.remove('hidden');
            }
        });
    }

});

/**
 * Toggles the module info panel below the buttons
 */
let activeModuleId = null;

function toggleModuleInfo(moduleId) {
    const allPanes = document.querySelectorAll('.module-info-pane');
    const allArrowIcons = document.querySelectorAll('.module-arrow-icon');
    const allButtonWrappers = document.querySelectorAll('.module-card');

    // Deactivate all buttons and hide all panes
    allArrowIcons.forEach(icon => {
        icon.classList.remove('rotate-90', 'text-black');
        icon.classList.add('text-mfyellow');
    });

    allButtonWrappers.forEach(wrapper => {
        wrapper.classList.remove('bg-mfyellow');
        wrapper.classList.add('bg-[#1c2b46]');
        wrapper.querySelectorAll('span').forEach(span => {
            span.classList.remove('text-black');
            if (span.classList.contains('font-black')) {
                span.classList.add('text-white');
            } else {
                span.classList.add('text-blue-200');
            }
        });
    });

    allPanes.forEach(pane => pane.classList.add('hidden'));

    if (activeModuleId === moduleId) {
        // If the same button is clicked again, close the currently active pane and reset activeModuleId
        activeModuleId = null;
    } else {
        // Activate the clicked button and show its corresponding pane
        const targetPane = document.getElementById(moduleId + '-content');
        targetPane.classList.remove('hidden'); // Show the target pane

        const wrapper = document.getElementById('btn-wrapper-' + moduleId);
        if (wrapper) {
            wrapper.classList.add('bg-mfyellow');
            wrapper.classList.remove('bg-[#1c2b46]');
            wrapper.querySelectorAll('span').forEach(span => {
                span.classList.add('text-black');
                span.classList.remove('text-white', 'text-blue-200');
            });
        }

        const arrowIcon = document.getElementById('arrow-icon-' + moduleId);
        if (arrowIcon) {
            arrowIcon.classList.add('rotate-90', 'text-black');
        }
        
        activeModuleId = moduleId;
    }
}

// Initialize: Show Module 1 content by default on page load
document.addEventListener('DOMContentLoaded', () => {
    // ... existing DOMContentLoaded logic ...

    // Ensure Module 1 is active by default
    const initialModuleId = 'mod1';
    const initialPane = document.getElementById(initialModuleId + '-content');
    const initialWrapper = document.getElementById('btn-wrapper-' + initialModuleId);
    const initialArrow = document.getElementById('arrow-icon-' + initialModuleId);

    if (initialPane) {
        initialPane.classList.remove('hidden');
    }
    if (initialWrapper) {
        initialWrapper.classList.add('bg-mfyellow');
        initialWrapper.classList.remove('bg-[#1c2b46]');
        initialWrapper.querySelectorAll('span').forEach(span => {
            span.classList.add('text-black');
            span.classList.remove('text-white', 'text-blue-200');
        });
    }
    if (initialArrow) {
        initialArrow.classList.add('rotate-90', 'text-black');
        initialArrow.classList.remove('text-mfyellow');
    }
    activeModuleId = initialModuleId;
});

/**
 * Manages info panel tabs with micro-fade animation updates
 */
function switchTab(event, tabId) {
    const panArray = document.querySelectorAll('.tab-pane');
    const btnArray = document.querySelectorAll('.tab-btn'); // This will now select 3 buttons instead of 4
    
    panArray.forEach(pane => pane.classList.add('hidden'));
    btnArray.forEach(btn => {
        btn.classList.remove('border-mfblue', 'text-mfblue');
        btn.classList.add('border-transparent', 'text-slate-500');
    });
    
    const activePane = document.getElementById(tabId);
    activePane.classList.remove('hidden');
    
    activePane.style.opacity = '0';
    activePane.style.transform = 'translateY(4px)';
    
    requestAnimationFrame(() => {
        setTimeout(() => {
            activePane.style.opacity = '1';
            activePane.style.transform = 'translateY(0)';
            activePane.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        }, 15);
    });

    event.currentTarget.classList.add('text-mfblue', 'border-mfblue');
    event.currentTarget.classList.remove('border-transparent', 'text-slate-500');
}

function toggleMapLayout(viewType) {
    const cityContainer = document.getElementById('city-map-container');
    const stateContainer = document.getElementById('state-map-container');
    const cityBtn = document.getElementById('city-map-btn');
    const stateBtn = document.getElementById('state-map-btn');

    if (viewType === 'city') {
        cityContainer.classList.remove('hidden');
        stateContainer.classList.add('hidden');
        cityBtn.className = "px-6 py-2.5 text-sm font-bold rounded-full bg-mfblue text-white transition";
        stateBtn.className = "px-6 py-2.5 text-sm font-bold rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition";
    } else {
        cityContainer.classList.add('hidden');
        stateContainer.classList.remove('hidden');
        cityBtn.className = "px-6 py-2.5 text-sm font-bold rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition";
        stateBtn.className = "px-6 py-2.5 text-sm font-bold rounded-full bg-mfblue text-white transition";
    }
}

function toggleSidebarTab(activeId) {
    const ids = ['sb-photo', 'sb-video'];
    ids.forEach(id => {
        document.getElementById(id).classList.add('hidden');
        document.getElementById('sb-btn-' + id.split('-')[1]).className = "pb-2 text-slate-500 hover:text-slate-600 border-b-2 border-transparent transition uppercase tracking-wider font-bold";
    });
    
    document.getElementById(activeId).classList.remove('hidden');
    document.getElementById('sb-btn-' + activeId.split('-')[1]).className = "pb-2 text-mfblue border-b-2 border-mfblue transition uppercase tracking-wider font-bold";
}

/**
 * Manages the paginated feedback section
 */
const allFeedbackData = [
    { name: "Dr. Honey Patle", location: "Sharad Pawar dental college, Nagpur.", image: "https://www.mohanfoundation.org/includes-rwd/images/radAC618.jpg", text: "As a transplant recipient, this course has been a profoundly eye-opening experience. Before enrolling, I only truly understood the tip of the iceberg—the medical miracle that saved my life. I had no idea about the massive, intricate world that operates backstage. Through this Ambassador course, I learned just how many people, organizations, and moving parts must seamlessly work together to make a single donation possible. Seeing the immense dedication of everyone involved behind the scenes has been incredibly humbling. Becoming a part of this mission through this training fills me with a deep sense of purpose. The knowledge I have gained will bring much more meaning to my life and beautifully aligns with what I seek to accomplish in my future. I am incredibly grateful for this course; it has empowered me to turn my personal gratitude into meaningful advocacy." },
    { name: "Mr. Vishvjeetsinh Zala", location: "Government Medical College, Bhavnagar.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad4FE7C.png", text: "I would like to express my sincere gratitude for the opportunity to participate in the online Organ Donation Ambassador Program. The training was highly informative, well-structured, and enriched my knowledge regarding organ donation band transplantation." },
    { name: "Ms. Nivedha R", location: "Manipal Academy of Higher Education, Vellore .", image: "https://www.mohanfoundation.org/includes-rwd/images/radD283C.jpeg", text: "The trainee program was well-organized, informative, and enriching. The sessions were engaging, and the speakers shared valuable knowledge and practical insights. The program enhanced my understanding of organ donation awareness, communication, and community engagement. Overall, it was a meaningful learning experience that was both inspiring and impactful." },
    { name: "Ms. Kavya Singal", location: "Delhi Public School, Chandigarh.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad94F4D.jpeg", text: "The Organ Donation Ambassador Training Module 2 t was very helpful and interactive session. I learned a lot by interacting with the organ recipients themselves and their truly inspiring stories. It motivated me to further create an action on organ donation soon!" },
    { name: "Ms. Akshita Kuthiala", location: "Delhi Public School , Punjab .", image: "https://www.mohanfoundation.org/includes-rwd/images/rad2DE20.jpg", text: "Thank you for conducting the Module 2 of the Ambassador Training. I found it very informative and inspiring, especially hearing about the real impact organ donation has on people's lives. It helped me understand that organ donation is not just a medical procedure, but a gift that can give someone a second chance at life. My only suggestion would be to include more personal stories from donors' families and recipients, as they make the message even more powerful, relatable and heartfelt. Overall, I am very happy with this session and definitely took away something valuable from it. It has made me more aware of the importance of organ donation and the difference it can make in someone's life. Thank you so much for the session and such an engaging activity." },
    { name: "Ms. Janani B", location: "Madurai Kamaraj University, Madurai .", image: "https://www.mohanfoundation.org/includes-rwd/images/rad442F8.PNG", text: "I found the Ambassador Trainee Module session to be very helpful and well-organized. It lasted about two hours, and every part of the schedule was incredibly useful. During the opening, I had the opportunity to introduce myself to the team and the other trainees, which was a great way to start. Since I am still new to the field, I dedicated the rest of the session to active listening, aiming to fully absorb all the insights and knowledge being shared. The best segment for me was definitely the 45-minute discussion with the experts, including the doctors, transplant coordinators, and grief counselors. Listening to them gave me a really clear look at both the medical and emotional sides of organ donation, which was deeply eye-opening. I also learned a lot from the 30-minute Gratitude Communication workshop because it taught me how to speak to families and individuals with true empathy, which is a very important skill for this field. Hearing the real-world experiences shared by everyone made the concepts feel alive and practical, which left me incredibly excited to begin my internship with the MOHAN Foundation." },
    { name: "Ms. Ushika", location: "Delhi Public School, Chandigarh.", image: "https://www.mohanfoundation.org/includes-rwd/images/radB45C8.jpg", text: "Module 2 of the ambassadors training by MOHAN Foundation was very inspiring and motivating. We got the chance to interact with experts and ask the doubts that were at the back of our minds. Today's session made us feel what it must feel like to be an organ recipient and what a \"second life\" actually means to them. The 2 hour session surely made me more compassionate and knowledgeable towards organ donation." },
    { name: "Ms. Anahita aggarwal", location: "Delhi Public School, Chandigarh.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad312BA.jpg", text: "It was a very informative and interactive session it gave me an opportunity to interact with medical professionals and organ recipients. I feel this experience will help me immensely in the completion of my future projects. Thank you for providing this experience." },
    { name: "Ms. Loveleesh Kaur", location: "Delhi Public School, Punjab.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad13866.jpeg", text: "The organ donation ambassador training session was very informative and eye-opening. It helped me understand how difficult life can be for people waiting for an organ transplant and how one donor can save many lives. The doctors explained everything in a simple and engaging way, which made the session very interesting. I learned the importance of organ donation and how it can give someone a second chance at life. Thank you to the doctors for educating and inspiring us about such an important cause." },
    { name: "Dr. Mahiman Raval", location: "Government Medical College, Bhavnagar.", image: "https://www.mohanfoundation.org/includes-rwd/images/radD3CAD.jpg", text: "I would like to express my sincere gratitude for the opportunity to participate in the online Organ Donation Ambassador Program. The training was highly informative, well-structured, and enriched my knowledge regarding organ donation band transplantation." },
    { name: "Ms. Harpreet Singh", location: "Delhi Public School , Chandigarh.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad5A57B.jpg", text: "I thought that the session was really interesting and interactive we really got to learn about the struggles and happiness of the patients as well as donors furthermore we also got really great ideas as to how we can inspire the people around us to join this cause." },
    { name: "Mr. Lirenthung N. Kithan", location: "MOHAN Foundation , Nagaland .", image: "https://www.mohanfoundation.org/includes-rwd/images/rad31BEE.jpg", text: "I would like to express my sincere gratitude to MOHAN Foundation for organizing the 'Gift of Life' – Organ Donation Ambassador Training and for providing this valuable learning opportunity through Module 2. The training sessions were informative, engaging, and inspiring, deepening my understanding of organ donation and transplantation and strengthening my ability to advocate for this noble cause. The knowledge, practical insights, and experiences shared by the facilitators have enhanced my confidence in promoting awareness about organ donation within the community. The module was well-structured, interactive, and highly relevant, helping me gain a better understanding of the importance of organ donation and the role of an ambassador in creating awareness and encouraging informed discussions. I sincerely appreciate the dedication and efforts of MOHAN Foundation and all the facilitators in delivering such a meaningful and impactful training programme. It has been a rewarding learning experience, and I look forward to applying the knowledge and skills gained to support and promote the cause of organ donation." },
    { name: "Dr. prachi brahmbhatt", location: "Marengo CIMS hospital, Ahmedabad.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad978D8.jpeg", text: "I was happy to attend module 2 of the Organ Donation Ambassador Training. your session . The sessions were informative, simple to understand and motivated me to carry on in this field of organ transplantation." },
    { name: "Ms. Sedekieno Rino", location: "MOHAN Foundation , Nagaland.", image: "https://www.mohanfoundation.org/includes-rwd/images/radC3E55.jpg", text: "I sincerely thank MOHAN Foundation for organizing the Ambassador Training Programme. At the beginning of this course, I struggled to express why I chose this course and simply wrote “to save lives,” but through this training, I now have a clearer understanding and a deeper sense of purpose. I truly appreciate the effort and guidance of the entire team, and I am grateful for this valuable learning experience." },
    { name: "Ms. Sieana Isha Barreto", location: "Shri Kamaxidevi Homoeopathic Medical College and hospital shiroda, Goa.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad386C6.jpg", text: "I m very grateful to get the opportunity to work as a organ donation ambassador.Both Module 1 and 2 were Very informative.It was a great experience with the experts And the session conducted by MOHAN FOUNDATION.Looking for forward to work with full enthusiasm for the betterment of the entire community." },
    { name: "Ms. Deepshikha kothiyal", location: "Dialysis technitian, Faridabad.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad9C109.jpg", text: "Thank you for this special training program here we learn a lot from you all. In my feedback it quite good to clear all the doubts related with the organ donation. And also providing the guideline how we start communication with the people around us or with the hospital also. Kindly find the and enclose file having the letter to the donor. Thank you once again for your support and guidelines." },
    { name: "Mr. Nikhil Nagarkar", location: "MOHAN Foundation, Mumbai .", image: "https://www.mohanfoundation.org/includes-rwd/images/rad23305.jpg", text: "The session was informative, practical, and addressed key medical, legal, and ethical aspects of organ donation with clarity. The course has strengthened my understanding and confidence to advocate responsibly for organ donation at the community level. I am grateful for this learning opportunity and proud to be associated with the Foundation’s mission of saving lives" },
    { name: "Ms Divya Sharma", location: "Apollo Hospital, Delhi.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad65783.jpeg", text: "I would like to sincerely thank MOHAN Foundation for conducting such an informative and impactful Organ Donation Ambassador Training.I found the training to be very effective and well-structured. Through this session, I learned about various methods and approaches for conducting organ donation awareness programmes in a more engaging and meaningful manner. The practical insights shared during the training have enhanced my understanding and confidence in organizing awareness initiatives.The panel discussion was particularly helpful, as the panelists patiently addressed and clarified all the doubts raised by the participants. Their clear explanations and real-life examples made the concepts easier to understand and apply.I would strongly recommend this course to anyone who is looking forward to conducting awareness programmes for this noble cause. It is truly valuable for individuals committed to promoting organ donation." },
    { name: "Mr. Sajan Jaiswal", location: "Banaras Hindu University, Delhi .", image: "https://www.mohanfoundation.org/includes-rwd/images/radC7F21.jpg", text: "Thank you for the enriching and well-structured training session. It expanded my understanding of organ donation advocacy beyond presentations and helped me think in terms of engagement, strategy, and meaningful impact. The discussions and diverse perspectives made the learning practical and inspiring. I have also written a LinkedIn post reflecting on the session and have attached the link below for reference. https://shorturl.at/Y4rn0" },
    { name: "Ms. Rachael Alphonso", location: "Avinashilingam Institute for Home Science and Higher Education for Women, Mumbai.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad1C0DD.jpg", text: "As an Ambassador Trainee I attended Module 2 on Feb 7, 2026. The session today was useful, mainly the Q&A. By now, we are already convinced about the importance of awareness, so there is no need to convince us further. We need more such arguments such as the one shared by Jaya on how to convince people who are uncomfortable with the idea of donation. We also need the awareness content to be translated in as many Indian languages as possible to reach a wider audience. Thank you for your work and all the best" },
    { name: "Mr. Rajesh Kumar Agrawal", location: "R K Groups, Dubai .", image: "https://www.mohanfoundation.org/includes-rwd/images/rad7D487.jpg", text: "Being a part of the MOHAN Foundation’s Ambassador for Organ Donation training has been a truly eye-opening journey for me. Before this program, I had a general idea about organ donation, but through the sessions, I’ve come to understand just how sensitive and impactful this subject really is. The training helped me grasp not only the medical aspects but also the emotional, ethical, and legal dimensions surrounding organ donation and transplantation. Listening to real-life stories and engaging in thoughtful discussions really brought home the human side of this cause. It made me reflect deeply on how much difference one decision can make in someone else’s life. I now feel more confident and better equipped to spread awareness, answer questions, and advocate for organ donation in my community. I’m truly grateful to the MOHAN Foundation for this opportunity and for inspiring me to become a more informed and compassionate voice for this life-saving cause." },
    { name: "Dr. Dhairya Sheth", location: "KD Hospital , Ahmedabad .", image: "https://www.mohanfoundation.org/includes-rwd/images/radB7927.jpg", text: "I Dr Dhairya Sheth Grief counsellor at KD Hospital Ahmedabad completed Module of the Ambassador Training and Gift of Life certificate course on organ donation at MOHAN Foundation The session was highly interactive, with experts sharing valuable insights on organ donation, addressing myths, benefits, and legal aspects. I gained practical knowledge to promote organ donation, learned to express gratitude to donor families, and developed empathy towards them. The training boosted my confidence to serve as an organ donation ambassador, equipping me with the skills to create awareness and make a difference. Overall, it was an informative , motivating and engaging experience, making it a great step forward in my journey to promote organ donation." },
    { name: "Ms. Sapna Rani", location: "SHRILADLI JI SEVA foundation, Darbhanga.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad149A5.jpg", text: "Strengths and what works well: The \"Gift of Life\" course is well designed to introduce participants to essential topics: organ donation basics, legal /ethical issues, religious perspective, deceased donation process e.t.c. This module 1, being of one day (approx4 hrs) online certificate course, is really impactful. The module 2 comprises hands on sessions, participants get \"always ready\" help from the mentors. The interactions helped ground theoretical learning in real -life experiences, allowing deeper understanding and personal connection. Kudos to the properly coordinated and responsive team." },
    { name: "Dr. Jaymin Bhat", location: "Nootan Medical College & Research Center, Ahmedabad .", image: "https://www.mohanfoundation.org/includes-rwd/images/rad6FED1.jpg", text: "A comprehensive understanding of the significance, protocols, ethics and legal ramifications of organ donation was given in the Organ Donation Ambassador Training. It sought to inform participants on the life saving potential of organ donation and to debunk common misconceptions. The seminar covers a variety of donor types, such as tissue, deceased, and living donations. The course was easy to follow and rationally organized. Medical experts with practical knowledge in transplant cases guided the sessions. Participants were kept interested via case studies, quizzes, and Q and A sessions. Testimonials from donor families and recipients increased the practical comprehension and emotional effect. Digital resources and educational booklets sent to me were important as additional reading. Overall, the Organ Donation Ambassador Training was informative, impactful, and well-conducted. It plays a vital role in addressing the shortage of organ donors by empowering participants with knowledge and encouraging them to become ambassadors of this life-saving cause. My recommendations for enhancement would be: Adding additional films or visual aids could boost comprehension, setting up visits with the assistance of transplant coordinators and other hospital management, adding a hands-on session or hospital visit (in person at a nearby transplantation facility) would provide a real-world context and apply for credit hours to medical councils to draw in more participants. The course has significantly increased my awareness and understanding of organ donation. It challenged common myths and provided clarity on how the system works. I now feel more confident in advocating for organ donation and intend to spread awareness in my community. Personally, I am now considering registering as an organ donor." },
    { name: "Mr. Sam Vikash", location: "IIHMR-Bangalore , Tirunelveli.", image: "https://www.mohanfoundation.org/includes-rwd/images/radFADF6.jpg", text: "I am grateful for the opportunity to be part of the Organ Donation Ambassador Training bythe MOHAN Foundation. The Gift of Life module gave me a clear and comprehensiveunderstanding of organ donation, including its process, types, the role of governing bodies,relevant laws, and the legal and ethical aspects.What stood out to me was learning about the human side of organ donation—especially thegratitude shown by recipients and how impactful it is to write thank-you letters to donorfamilies or hear recipient stories. These experiences made the cause feel even morepersonal and meaningful.This training gave me the confidence and knowledge to conduct two successful awarenesssessions, one at Siddha Clinic and another at a Law college. It was fulfilling to help spreadawareness and encourage conversations around organ donation.Thank you, MOHAN Foundation, for this insightful and inspiring experience." },
    { name: "Ms Shloka Reddy", location: "O P Jindal Global University, Sonipat, Haryana.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad3A837.jpg", text: "The ambassador training provided me with a strong foundation for everything I did during the internship. It introduced me to key concepts and perspectives on organ donation and transplanation that helped me approach each task with clarity and purpose. The training really set the tone and pace for the rest of my internship and made every activity more meaningful. Thank you so much for this incredible opportunity. Please let me know if there is anything else you need from my end." },
    { name: "Mr. Sushil Kharinta", location: "Haryana.", image: "https://www.mohanfoundation.org/includes-rwd/images/radC3324.jpeg", text: "It was truly a wonderful experience to be part of the one day certificate course & OD Ambassadors course organised by the MOHAN Foundation. The program enriched my knowledge and deepened my understanding of the mission of organ and body donation - a cause that is very close to my heart. My father had pledged his body, and we honored his wish by donating it to a medical college. Inspired by this experience, I am eager to motivate others to contribute to this noble cause under the guidance of the MOHAN Foundation. Looking forward to staying connected." },
    { name: "Mr. Sameer Khan", location: "Jamia Millia Islamia, New Delhi.", image: "https://www.mohanfoundation.org/includes-rwd/images/radFDCAD.jpg", text: "As a student of the Advanced Diploma in Public Health at Jamia Millia Islamia, New Delhi, I had the enriching opportunity to intern with the MOHAN Foundation in November 2024. During this time, I also enrolled in the Organ Donation Ambassador Program — a well-structured and insightful initiative that deepened my understanding of organ donation and equipped me with the knowledge and confidence to spread awareness in my community. Alongside my colleague Eram, I conducted two community intervention programs in the slum areas of Okhla, South Delhi, where we sensitized residents about the significance of organ donation. The entire experience — both the training and the fieldwork — was deeply meaningful and eye-opening. I am sincerely grateful to my supervisor, Ms. Simran Anand (Senior Program Manager), and Ms. Pallavi Kumar (Executive Director, Delhi-NCR), for their continuous support and for providing such a valuable platform to contribute meaningfully to society as an Organ Donation Ambassador." },
    { name: "Mr. Parth Sharma", location: "IIT BHU Varanasi, Delhi-NCR.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad07A0D.JPG", text: "It was a delight to be a part of the Ambassador Training and meet other like-minded individuals passionate about organ donation. The training was well-structured and provided key insights into effective methods for raising awareness and motivating others to pledge their organs. Hearing the first-hand experience of an organ recipient - her struggles, the long wait, the hope, and ultimately receiving the gift of life - left me even more committed to the cause. The insights shared by grief counselors and transplant coordinators have been invaluable in my journey as an ambassador, especially when addressing the emotional apprehensions people often feel when I encourage them to make an informed decision and pledge their organs. The opportunity to ask questions directly to experts further helped me develop technical knowledge and gain a deeper understanding of the organ donation process. A huge shoutout to Dr. Muneet Kaur Sahi, Dr. Hemal Kanvinde, and Ms. Arshiya for facilitating this excellent training, and to MOHAN Foundation for providing us with a platform to transform sporadic volunteer efforts into sustained programs and activities." },
    { name: "Mr. Vijay S", location: "Tamil Nadu National Law University, Chennai.", image: "https://www.mohanfoundation.org/includes-rwd/images/radF2A5C.jpg", text: "The ambassador training in the MOHAN Foundation, which was really helpful was that it made me understand the functions of vital human organs. The training imparted both theory as well as practical aspects of organ donation and transplantation. The MCQs were all taken care of. I really thank MOHAN foundation for this opportunity to know in depth about organ donation and organ functions. My two talks in the community gave me immense pleasure, confidence and a sense of knowledge that I can answer all public queries." },
    { name: "Dr. Anita Hada Sangwan", location: "Jaipur.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad58CD3.jpg", text: "Thank you so much for your support during the Organ Donation Ambassador Training. I really enjoyed the online training schedule on 18th June 2022. The experts were knowledgeable, open to questions and very motivating and encouraging for us, the trainees. There was an environment of learning and brainstorming in the entire session which emboldened us to ask questions, learn and put forth our views with confidence. A lot of doubts were cleared by the session and I would like to convey my gratitude to the experts and the MOHAN team for such a perfectly planned, well-balanced, smooth and well-coordinated training session." },
    { name: "Mr. PRATAPSINH PARMAR", location: "Kheda District, Gujarat.", image: "https://www.mohanfoundation.org/includes-rwd/images/radE4597.jpg", text: "It was very nice meeting with you (MOHAN FOUNDATION) on June 08, 2024. I thank the team at MOHAN Foundation for conducting this interaction. In the meeting, I got a lot of useful information which I can discuss the importance of donating human organs and human body with my family. Body donation is very important for medical studies. I will be ready for this kind of higher studies about human organ donation from MOHAN Foundation. Another highlight of that meeting is that I was able to get enough information after interaction with Doctors, Transplant Coordinator, Organ Recipients. The letter during the Gratitude Communication workshop can be seen here. With your blessing, an awareness program will be organized at the district level under my plan in Gujarat next month. This will create awareness about organ donation to encourage citizens to ‘Donate organs’ and how patients can get human organs with registration procedure through the state government. After the success of this program, with your kind permission I wish to start a branch of MOHAN Foundation in Gujarat." },
    { name: "Mr. Pramod Ningombam", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad4489F.jpg", text: "I am writing to share my feedback on the recent organ donation ambassador training program conducted on June 8, 2024, via Zoom. I am glad that I could be a part of the session, which lasted two and a half hours, preparing participants with the knowledge and skills necessary to become organ ambassadors. The training covered a range of essential topics pertaining to organ donation. Particularly impactful was the segment focusing on organ and body donation, including discussions on pledging and the legal aspects surrounding organ donation. The trainers exhibited a commendable level of effectiveness in delivering the content. The explanations were articulate, and the pacing was well-suited for an online format. The utilization of slides further enhanced the clarity of complex concepts. However, I would suggest providing participants with access to the slides and additional resources for further exploration and reference. From a journalist's perspective, the training provided valuable insights and a deeper understanding of the organ donation process. This knowledge is crucial for accurately reporting on this important issue and for raising public awareness. The program highlighted the significance of organ donation and the legal and ethical considerations involved, which will be instrumental in informing my future articles and reports. Overall, the training was highly informative and motivational. It afforded me a comprehensive understanding of organ donation and instilled in me the confidence to serve as an organ ambassador effectively. I extend my sincere gratitude to the organizers for orchestrating such an enlightening training program. I appreciate the effort put into making it a success and look forward to utilizing the knowledge gained to contribute to raising awareness about organ donation through my work." },
    { name: "Ms. Farzana Saadulla", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad8831F.jpg", text: "Firstly, I would like to express my gratitude and sincere thanks to MOHAN Foundation for the wonderful work they have been doing all these years. I had enrolled for the Organ Donation Ambassador program and have successfully completed the same. It was very informative and gave me an insight into the entire organ donation process specially the legal aspects. Lectures and presentations were short and informative. The interaction session for module 2 conducted by the panel of experts was also very engaging and informative. I did face some technical issues during the first module but it was resolved within two weeks. Overall good learning from the program." },
    { name: "Ms. Gladys Choo Sung Hee", location: "Kuala Lumpur, Malaysia.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad792D3.jpg", text: "I have been searching for a meaningful project to undertake for my Toastmasters Distinguished Program, one that can benefit an organization. That's where I stumbled upon the idea of Organ Donation. However, despite my eagerness to get involved, I was unable to find any suitable resources in my country. It was only through a fellow Toastmaster from Bengaluru that I learned about MOHAN Foundation. Module 1 of the training was incredibly valuable and informative for beginners like myself. It helped me to grasp the fundamental concepts of organ donation and to understand how we can truly make a difference by saving lives. Module 2, brought us to an interactive session and encouraged participants to take action and the support group was amazing. Kudos all. I am impressed by the dedication and passion of all the faculty and staff members, it was a great learning experience for me. While I find myself stuck on some points at Module 1, I believe having a guidance team to assist participants when they veer off course would be immensely helpful. My ultimate goal is to organize a panel discussion featuring transplant surgeons, recipients, live donors, and grief counsellor. By raising public awareness through such publicity, I hope to make a significant impact in nudging all Malaysians to look at organ donation in a positive manner." },
    { name: "Ms. Pinal Chauhan", location: "Dubai.", image: "https://www.mohanfoundation.org/includes-rwd/images/radCD406.jpg", text: "I have always wanted to be an active part of supporting the cause of gifting life to others. I started my journey with the foundation by pledging my organs in Feb'12. And gradually started spreading the awareness of the cause. I always wanted to be one of the Ambassadors and provide my services with the foundation. My first step to it was to do the Gift of Life course and then attending the 2nd module of the Ambassador Program which was interaction with the experts. It was such an amazing session where all our doubts, questions were cleared and not only that but with all the detailed discussions related to each queries and situations the volunteers and experts come across in person. We were also given a task to be completed in a targeted time, which actually tested our instincts of what would be our feeling as a recipient. Overall, this module is a 10/10 session of the program." },
    { name: "Ms. Bhavana Kapadia", location: "Mumbai.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad6A15E.jpg", text: "The training is designed in a very thoughtful manner. Module One - the self-learning material was excellent. I could peacefully read, learn & and absorb the information related to organ donation. There were a couple of queries /doubts while reading module one. The majority of these were resolved by the end of module two. Module two gave us an opportunity to meet experts and learn from them. Meeting other ambassadors also heightened my motivation towards the cause. I felt very connected to the ambassadors & wish we could jointly do things." },
    { name: "Ms. Aaina Kureel", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radB37F1.jpg", text: "The 'gift of life' online course was clear and easy to follow. About organ donation and transplantation, I learned a lot. Additionally, the idea of brain death was described in great detail. The training provided detailed explanations of the scientific aspects of body donation. In the second module, participants engaged in an interactive Zoom session that provided them with the space and confidence to discuss and learn more about organ donation. I was a little uneasy at first because we had to introduce ourselves, but I soon got into it and was astounded at how patiently the experts responded to each and every participant's question. They provided a fantastic response to my question. I was a touch overwhelmed while I was writing a letter of thanks to the donors' family. But I made an effort to be as appreciative as I could. I'm pleased to say that applying for the ambassadors training at the MOHAN Foundation was a wise choice because I learnt not just about organ donation but also about how \"work\" works. Thank you so much for this amazing opportunity." },
    { name: "Mr. M. Rajendran", location: "Chennai.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad16EB8.jpg", text: "The two hour session conducted on 15 July, 2023 was quite useful for beginners like me. The interaction with experts was the highlight. We could get clarified on important issues like \"the brain death\", \"how to handle relatives, friends, peers when they were emotionally in disturbed stage because of a patient's end of life status and to make them agree for the noble cause of Organ Donation\" and Ethical issues. Thank you to all the team members." },
    { name: "Dr. Jyoti Ravikumar", location: "Australia.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad55E12.jpg", text: "I must say, the training session was so heartwarming. It was really nice to meet everyone, to be able to put names to the faces. Not just that, it was lovely to see how everyone is contributing to this cause in their own way, to have some stimulating discussions and to have the questions answered. for the letter of gratitude conducted in the session. Overall, it was a great session." },
    { name: "Mr. Vikram Bansal", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radA8A7D.jpg", text: "This is to thank you for letting me participate in the session/training on organ donations. Being a transplant recipient myself, I support the cause passionately and sincerely. It was wonderful to interact with the eminent panelists and hear their words. The Q&A session was hugely informative and helped to clarify many doubts. I look forward to taking forward the noble cause in whatever small or big way possible for me." },
    { name: "Mr. Prakash Bapat", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radC6130.jpg", text: "Gift of Life Module was well drawn and had a lot of input about the organ transplantation. We are equipped with adequate material to represent as ambassador on behalf of MOHAN foundation. The MCQ, VIDEO, has helped us to understand the topic and subject. I suggest that the statistical data can be added about in tabular format to understand gravity of the subjects and have the bird eye view. Today’s session (Module2) with experts and recipients was also educational. Hope to contribute to motto of MOHAN Foundation." },
    { name: "Ms. Prathuyusha K", location: "MMM College of Health Sciences, Chennai.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad5B921.jpg", text: "Module 1: Gift of Life course helped me a lot as the concept of organ donation was new to me. I learnt how organ donation is done, what are the organs to be donated, time factor for transplantation, types of organ donation and much more. The presentations and videos made it interesting while learning concepts, especially the quiz which was asked in-between. It made me confident because a Gold Star was awarded for every correct answer. It reminded me of my childhood school days. Module 2: This module was very informal and interactive. It was informative with doctors and counsellors openly discussing points raised by the participants. Many doubts were cleared. I learned how to show gratitude to the donor family through letters. It was very heart – touching and useful to me. I wrote a gratitude letter. Learned how to promote organ donation to the public through different awareness modes. The feedback poll at the end of the session was interesting." },
    { name: "Ms. Vijaya Lakshmi M", location: "MMM College of Health and Science, Chennai.", image: "https://www.mohanfoundation.org/includes-rwd/images/radEE245.jpg", text: "The Gift of Life Course is module 1 and it was very helpful to know about the brain death, cardiac death, types of organ donors and myths and facts about organ donation. I attended the module 2 on March 18, 2023. Now I understand more about organ donation. The Ambassadors were asking many questions about organ donation and whole-body donation and it was interesting to see the honest way the faculty were answering all queries. This session was extremely beneficial to my understanding of organ donation." },
    { name: "Ms. Vedhika N", location: "MMM College of Health and Science, Chennai.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad09E6B.jpg", text: "As part of the internship, I trained as an Organ Donation Ambassador. The Gift of Life Course gave me a basic knowledge on the terms and conditions underlying organ donation. This was followed by Module 2 session which was conducted by the series of doctors and experts on organ donation by the MOHAN Foundation team. This cemented my knowledge and also helped me empathize with donor families. MOHAN Foundation staff then helped to create awareness on organ donation among the public. If you are someone who is very passionate to learn about organ donation then, I would blindly suggest to go for MOHAN Foundation. It is a great platform to learn and acquire skills." },
    { name: "Ms. Preetha P", location: "MMM College of Health and Science, Chennai.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad1063C.jpg", text: "Under the Organ Donation Ambassador Training I have completed a one day online course in MOHAN FOUNDATION. This type of learning process was new to me. His course clarified many doubts on organ donation like do’s and don’ts in organ donation, how organ donation occurs, what is NOTTO, how organ donation changes the life of a recipient, what tissues and organs can be donated by a living donor and what are the organs retrieved from brain dead donor. The Module 2 was an interesting informative session with interactive sessions. Faculty for this session were experts from different fields and MOHAN foundation team. This equipped with skills to speak to people about organ donation. I have been conducting talks and setting information desks to create awareness." },
    { name: "Ms. Lakshya Leo", location: "Chennai.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad5C57D.jpg", text: "Module 1: The Gift of Life course dealt with the concept of organ donation right from the basics which is highly essential, so that anybody could understand and be aware of the concept. The course dealt in detail regarding the scientific aspect of the process of organ donation as well as the ethical and legal aspect of body donation were insightful. I felt that more content regarding whole body donation could also be added in the course. Module 2: The module 2 was an interactive zoom session that actually gave the participants enough space to speak about their thoughts and to ask the questions that the participants had, to the various experts of the field. The idea regarding how to communicate with a donor family was spoken about. The value of empathy and understanding towards the donor family was imparted. The module even dealt with the importance of awareness among people and various ideas over how to create awareness among a cross section of the population. As a whole the module has been helpful in understanding the practical application of conducting awareness among the public and talking to the donor family." },
    { name: "Mr. Sivaram Vemu", location: "Chennai.", image: "https://www.mohanfoundation.org/includes-rwd/images/radA0DD4.jpg", text: "The Module 2 of Ambassador training session started with a brief introduction of all the interns and volunteers that had taken the Module 1 training online. Then, all the doctors introduced themselves to us. The first section of the training consisted of a doubt clarification wherein all the interns and Ambassadors asked their doubts regarding organ donation and the various issues relating to it. All the doctors answered these doubts with utmost enthusiasm and patience. They also provided different life examples that they remember in order to provide a better context to the person. From one topic to another, various discussions took place, some of them being which is a better policy, opt in or opt out, whether there really was a human rights violation in China in 1990, why sale of organs is prohibited and various other ethical, legal and technical issues. It was a very interactive and interesting session as everyone participated with utmost enthusiasm. Next, we were told about the situation of the donor family and how a simple thank you note to the donor family would reflect in the fast recovery of the donor. We were told how to write a thank you note. After this, we were asked to write a sample thank you note and were given a time of 5 minutes. Everyone had to read out their thank you note in front of the doctors. The facilitators were very happy with our performances. Writing a thank you note helped me understand the importance of a donor family and to not simply take for granted anything. It also led me to think how life changing it is for both the donor and the recipient. The session ended with the host asking all the participants how they would like to contribute to organ donation. It was a very productive session and time went away fast during this session." },
    { name: "Mr. Pranav Sridhar", location: "National Institute of Technology, Trichy.", image: "https://www.mohanfoundation.org/includes-rwd/images/rad19C1D.jpg", text: "The Module 2 of the online training was a lively Zoom session which gave me a lot of insight over the realities of how organ donations take place - from the challenges in approval to the tears of joy during recovery. Interacting with experts from the field provided a nuanced look into what happens during such critical times. The 'Letter of Gratitude' section made me see heroes in the families of organ donors. True to the purpose of this course, I shall now take every step to push forward the awareness regarding organ donation among my circles." },
    { name: "Ms. Anitta Varghese", location: "Iqraa Hospital, Calicut.", image: "https://www.mohanfoundation.org/includes-rwd/images/radCA350.jpg", text: "For me module 1 was like a lot more add on information that I completed in a couple of hours. It was really helpful to understand what exactly is organ donation, ithe donor card and more over the basic requirement and things we need to keep in mind during this procedure of deceased organ donation. In module 2 it was a good interactive session where everyone shared their experience and also we were coached on how to prepare a ppt and the points that need to be included." },
    { name: "Ms. Manasi Joshi", location: "International Institute of Information Technology, Pune.", image: "https://www.mohanfoundation.org/includes-rwd/images/radEA3A8.jpg", text: "I am Manasi Joshi from Pune. The Gift of Life course was really informative. I never had interest in the medical field and I did not have any prior knowledge about organ donation and its process. The Gift of Life course added much knowledge to me. All theories, ppts, animated videos explaining brain death were very easy to understand. The interactive session with experts and different stakeholder in organ donation and transplantation cleared all my doubts. This also generated my interest in the medical field. This course also gave me ideas about how I can proceed with my project that included making a course. Thank you so much for this course!" },
    { name: "Ms. Vijayashri Kumarvel", location: "MMM College of Health Sciences", image: "https://www.mohanfoundation.org/includes-rwd/images/radB8874.jpg", text: "The Gift of Life course was full of videos and presentations. It was very useful to know about MOHAN Foundation and the process of organ donation and save lives, it came through basic concepts, brain stem death, legal aspect and promoting health and preventing organ failure. I watched and learned through videos with full of good information. It shall help me to do my practical situations in organ donation awareness. The presentation were a bit boring for me. In Module 2 interactive session, I explained about my motive in organ donation. I loved the Question and Answer session, amazed how the experts are giving a very informative answer to all of our questions. For my question they just give a great answer. Writing a letter go gratitude was very emotional. In this session I loved to hear the kindly words from every participant in that class. I also did my best in the letter of mine. From module one and two. I learned more things and helped me a lot." },
    { name: "Ms. Keerthika D", location: "MMM College of Health Sciences", image: "https://www.mohanfoundation.org/includes-rwd/images/rad64E83.jpg", text: "I would like to thank MOHAN Foundation for Module 1 “Gift of Life” course. The videos and presentations were very informative and I gained more theoretical knowledge. It was interesting the ways the tests were designed based on the videos and articles. Donor and recipient stories were very impressive and motivating, which helps us to pledge for organ donation and learned in-depth on organ donation. It was a good learning experience. Module 2 was started with recipient Mrs. Jaya Jairam explaining about the Ambassador program. Followed by expert’s interaction, it was a very interesting session. Many participants asked their doubts and all were clarified patiently. The gratitude communication workshop brought out emotions, feelings, sufferings, struggles, difficulties faced during the end stage of life and happy life after transplantation. It was a truly lovely activity. I got new ideas to create awareness among public by the examples put up by Dr. Hemal. I particularly enjoyed the “Ask the experts” session and the Tips on OD awareness PPT. Thanks for such valuable sessions." },
    { name: "Ms. Aswathy A C", location: "MMM College of Health Sciences", image: "https://www.mohanfoundation.org/includes-rwd/images/rad2E73B.jpg", text: "In module 1, I liked the explanation videos on organ donation, law of organ donation and stories of hope. The assessment questions which were asked after each and every topic improved my understanding of the subject. In module 2, Mrs. Jaya Jairam’s kidney transplant story was inspirational. Writing a Thank You letter and Ask the Experts session was a good way of making me understand different aspects of donation. Dr. Hemal’s enumeration of different campaigns on organ donation was an eye opener. I am very much interested in counseling and public awareness." },
    { name: "Ms. Glory Saleesha V", location: "MMM College of Health Sciences", image: "https://www.mohanfoundation.org/includes-rwd/images/rad7DFA0.jpg", text: "The videos and presentation in Module 1 were very useful and I learned many new concepts like the process of organ donation, more about brain death etc,. I rewatched the videos and took notes which were all very informative. The Module 2 was very interactive. I was a little nervous at the beginning with a self introduction but later enjoyed and amazed on how experts answered our each and every question patiently. In the Gratitude Communication workshop, we were asked to write a gratitude letter for the donor family. This made me think of the second chance the patient has received and it was interesting to listen to the letters from other participants. Overall the module1 was more of information and sometimes felt boring since I did it alone. But module 2 was more informative and energetic too since I was able to see people gracing with smiles during the interactions." },
    { name: "Mr. Aditya Kumar", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radA6D92.jpg", text: "The Gift of life' Online eLearning course was brilliant and well curated. The Module 2 - Interactive sessions were nicely done in times of COVID19 pandemic. Good to see volunteers taking many steps to spread awareness. An interactive way of learning with a good delivery of design and technology in the course material would be really helpful." },
    { name: "Ms. Preeti", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radCAE3A.jpg", text: "'Gift of life' Online eLearning course, was really helpful as it cleared all my doubts regarding Organ donation from scratch. In the Interactive session, we met a lot of new people, some of them were organ donors too, listening to them was so encouraging yet blissful. Their experience taught me a lot of things. Organ donation is a less explored topic for the general public we all need to find out ways in which we can spread out the message of \"Organ Donation and Saving lives\"." },
    { name: "Ms. Atluri Sri Vidya", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad2496A.jpg", text: "The 'Gift of Life' Online eLearning course was really good and interesting. It has given me a completely new approach towards organ donation and the way tasks were conducted made me more eager to complete it and helped to understand the need of organ donation. The Interactive Session helped me to learn more about the practicality and how the organ donation is reality. It was really very informative and I have understood the blessing and the pain of during the organ donation. The specialists have done a great job in the session. I got to learn many new things that I'm completely unaware before the session. My Awareness Initiative has given me a chance to present myself before my friends and loved ones. The audience really liked and appreciated the cause. I'm really glad that I conducted the awareness program and cleared their doubts." },
    { name: "Mr. Subash Sarangi", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radF9BAE.jpg", text: "My association with MOHAN (Multi-Organ Harvesting Aid Network) Foundation, Chennai is really an awesome experience. I could make my life more productive and meaningful by pledging for Organ Donation through MOHAN Foundation. \"Gift of Life\" One-day online certificate course on Organ Donation launched by the Foundation is a unique course that gives the basic idea of Organ Donation and Transplantation, Legal & Ethical aspects of Organ Donation and transplantation, Religion and Organ Donation, Deceased Organ Donation – its process and significance, while even sitting at the comfort of my house just on mouse clicks. During the COVID-19 pandemic, when there was no option available to do, except to keep oneself confined to home because of extensive worldwide lock down, I could learn a lot of things about Organ Donation that broadened my outlook and enriched my values as a responsible citizen of this planet. My time and energy could be utilized creatively. I feel proud and a sense of fulfilment from within. I could discover a new 'ME' within me. Interactive session organized was an excellent facilitation and supportive tool to me for building confidence and promoting the spirit of Organ Donation. I could be proud partner of such a great movement of Organ Donation launched by MOHAN Foundation. My conceptual clarity reached to a higher level. The homely touch and the valued nurturing inputs availed from the faculties and members of the foundation were truly distinctive. Awareness initiative was basically a Capacity-Building Exercise for me which boosted my enthusiasm to a large extent. Passion to become an Ambassador of Organ Donation became intensive and the keenness to reach out to the common people for the sake of spreading awareness on Organ Donation grew multiple times. Though I had pledged, about 10 years ago, for Organ & Body Donation, for transplantation, medical education and research, now I could feel the need & justification of getting myself involved directly in the process of spreading awareness on Organ Donation among the community and make life more momentous." },
    { name: "Dr. Syeda Sana Ali", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad523BE.jpg", text: "The 'Gift of life' Online eLearning course gave me a better understanding about the ethical complexities in organ donation. Also, the concept of brain death was very well explained. Module 2 was primarity an interactive session and the open discussions that were held during the session helped me explore different avenues to raise awareness about organ donation." },
    { name: "Mr. Umar Nath. P", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radEAB81.jpg", text: "The 'Gift of life' Online eLearning course was easy and simple to follow. I learnt about Organ Donation, Brain death certification and transplantation law. And also I learnt about the process of Organ Donation. The second module was very useful and interactive about Organ Donation. Many doubts were cleared. Mrs. Jaya Jairam's recipient story made a deep impact on me. My awareness initiative gave me confidence on how to give awareness about Organ Donation to the public." },
    { name: "Mr. Naveen Antony", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad0914A.jpg", text: "Through the Gift of Life online course I understood the concept of organ donation, organ donation processes, skin donation and whole body donation. The interactive session was useful in understanding the complexity and ethical challenges in Organ Donation and Transplantation. I heard about a liver donation story of father to daughter narrated by Mr. SivaRamaKrishna Pakala, this really moved me. My awareness initiative gave me confidence to speak to the public though I needed to practice it many times before going ahead." },
    { name: "Ms. Kavitha Shinde", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad65FF3.jpg", text: "I recently completed the three-part online training on organ donation conducted by MOHAN FOUNDATION, which also included a Zoom session, and I wanted to share my comprehensive feedback on the experience. Firstly, the modules were exceptionally well-structured and informative. Each part was designed in a way that gradually built upon the previous one, making it easy to follow and understand even for someone new to the topic. The content was presented clearly, with a good balance of text, visuals, and interactive elements. The interactive elements, such as quizzes and videos, were particularly engaging and helped reinforce my understanding of the material. They also made the learning experience more enjoyable and interactive, which I appreciated. I found the real-life stories shared during the Zoom session and within the modules to be incredibly impactful. Hearing directly from individuals who have been affected by organ donation helped me understand the human side of this topic and its profound impact on both donors and recipients. Additionally, I appreciated the efforts made to address common myths and misconceptions about organ donation. The module provided clear, evidence-based information that helped dispel any misconceptions I may have had. Overall, I found the online module and Zoom session to be invaluable. They have not only increased my knowledge and awareness of organ donation but have also inspired me to consider becoming an organ donor myself. I would highly recommend this program to anyone interested in learning more about organ donation and its impact." },
    { name: "Ms. Pavithra Selvi Thevar", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad1236C.jpg", text: "I have completed the online module on organ donation and wanted to share my feedback. The zoom session was very interactive and the questions were clarified by them in an easy and understandable way also. The experts in the session emphasized module 1 and as well module 2 in a precise way. I have gained knowledge about various aspects of the organ donation methods and also about the facts and myths which I was able to differentiate about after the session. It was also a kind of a brainstorming when the questions were added by the speakers throughout the both modules also. Amazing videos, presentations and photographs helped us to make it more interesting and attractive I am very happy that I was able to attend and be a part of this session and gain lots of knowledge from these modules. It will help to provide awareness and literacy to the community. I am very grateful to MOHAN FOUNDATION for arranging this fantastic and insightful course i.e; \"Gift of Life\" followed by Ambassador training." },
    { name: "Ms. Rani Thapa", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad511D6.jpg", text: "I am very grateful to MOHAN FOUNDATION for arranging this fantastic and insightful course i.e \"Gift of Life\". As the name suggests, I hope this program may become a gift of second opportunity, insightfulness, awareness, good deeds, generosity, fair and square experience and rebirth for living ones (donor, receiver, learner, community people). The course had several modules and after completion of all, one can receive the certificate of successfully completing the course on organ donation. #Module 1: Orientation about organ donation which explained various types of organ donation, who are eligible for it, process of organ donation in deceased and brain dead patients, also video lectures about it and video interviews of the donor's family about their experience, feelings. The module was very precise, helpful and explained in a very easy manner, hence making me knowledgeable about organ donation. #Module 2: It was an interactive session between the experts and trainees. Hence, various trainees were connected via zoom meeting and given an opportunity to clear their doubts by asking them relevant questions on organ donation. At the end of this session, one expert asked all the trainees to empathise with the donor's family and write a Thanksgiving letter to the donor's family by keeping our identity anonymous. Hence, this module helped me to understand the feelings of the recipient (second life) as well as the donor's family and how life is precious. Also, resolved many doubts about organ donation. #Lastly, for receiving this certificate we have to do one awareness activity in the community, such as poster making, slogan making, essay writing, elocution about organ donation etc. Like this, we have done an activity and taken one of the organs for organ donation topics such as skin donation and given a health talk with poster (chart) to the community for their awareness and to provide knowledge and to eradicate myths related to \"Organ Donation.\" Literally this module course on organ donation was very interesting from beginning to end and I have learned new things about it and \"I have also taken a pledge to donate my organs after my death.\" Therefore, I highly recommend this program to others who really want to acquire knowledge about organ donation and want to donate their organs to the needy and for those who are having many doubts regarding the organ donation and its complete process. I really wish that MOHAN FOUNDATION can help multiple people around the world and help those who are at the edge of their life through this program. So one can \"GIFT THE LIFE\" to others who want this precious second life, chance and rebirth and deceased be relive long in their memories." },
    { name: "Mr. Omkar Gorakh Tupe", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radDD559.jpg", text: "I have completed all modules. The module covers essential topics related to organ donation, including the donation process, benefits, myths, and legal aspects. Overall, I found the module to be incredibly insightful and thought-provoking. Some sections may benefit from clearer explanations or simplification of complex concepts to ensure understanding by all users. In conclusion, the online organ donation module demonstrates several strengths in its comprehensive content coverage, user-friendly interface, and effective use of engaging elements. However, there are areas for improvement, such as enhancing clarity of information, incorporating more interactive features, and integrating a feedback mechanism for continuous improvement. By addressing these areas, the module can further enhance its effectiveness in educating and motivating users about organ donation." },
    { name: "Ms. Ankita Bhalchandra Narvekar", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radA7D9B.jpg", text: "I have completed the online module on organ donation and wanted to share my feedback. It was a very great module that you organised. It was an interactive session and I learned about organ donation. So I am thankful to you that all your modules were really helpful to us." },
    { name: "Mr. Sahil Sunil Jirwankar", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radFAFD2.jpg", text: "It is a pleasure to complete an online module on organ donation by MOHAN FOUNDATION. Overall it was a very good experience and I found it a very informative and helpful training. It consisted of various sessions, each and every session was so knowledgeable and gave a new way to look at life. I am glad that I got the opportunity to complete this Ambassador Training. At last I would like to say that the modules taught me a lot not only about organ donation but also the emotion and thinking of people in our society and their perspective on life. I am very thankful that I took this opportunity to learn about organ donation." },
    { name: "Ms. Sushma Gupta", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radE3392.jpg", text: "First of all I would like to thank the MOHAN FOUNDATION for conducting this training and including us. The session was easy, clear and simple to understand. I learnt a lot of things in this session about organ donation. But after attending this session I came to know a lot of things. I am glad and feel lucky that I have not missed this training. It was worthwhile. I will share this information to everyone who can donate or save the life of others / give 2nd life to them. I would also like to give health education in clinicals so that to save some more lives. Now I will stop my words by saying: Thanks a lot for sharing and providing knowledge and information. It was a really good experience." },
    { name: "Mr. Mayur Rajendra Sonawane", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad377AB.jpg", text: "I have completed the online module on organ donation and wanted to share my feedback. The zoom session was very interactive and the questions were clarified by them in an easy and understandable way also. The experts in the session emphasised module 1 and as well module 2 in a precise way. I have gained knowledge about various aspects of the organ donation methods and also about the facts and myths which I was able to differentiate about after the training. It was also a kind of a brainstorming when the questions were added by the speakers throughout the both modules also. The amazing videos, presentations and photographs helped us to make it more interesting and attractive. I am very happy that I was able to attend and be a part of this session and gain lots of knowledge from these modules. It will help to provide awareness and literacy on organ donation to the community. I am very grateful to MOHAN FOUNDATION for arranging this fantastic and insightful course i.e \"Ambassador of Organ Dontion\"." },
    { name: "Mr. Omkesh Dayaram Chate", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad293E1.jpg", text: "I have completed the Ambassador training on organ donation and wanted to share my feedback. I have learnt lot of things during organ donation session. Q&A session with experts was very good. I have gained knowledge regarding importance of organ donation and methods to create awareness. Thanks a lot to 'MOHAN FOUNDATION'." },
    { name: "Ms. Shivani Kesarkar", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad371B1.jpg", text: "I have completed an online modules for organ donation and I am able to gain knowledge about organ donation. The training was really helpful for us. I would like to thank the ‘MOHAN foundation’ for organising the Ambassador training for us. Organ donation is a second life for patients and we are able to gain knowledge about it and also about how to spread information in the community and patients for betterment in their life." },
    { name: "Mr. Yogesh Bhagnure", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad161B0.jpg", text: "I have attended the Ambassador Training organised by ‘MOHAN foundation’ about organ donation, I was able to gain knowledge about organ donation and transplantation." },
    { name: "Ms. Ashmita Pujary", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad29B66.jpg", text: "I have completed an online module to become an Ambassador of Organ Donation. I was able to gain knowledge about organ donations, transplantation, counseling and methods to create awareness. The session has interesting videos, presentations etc The session really helped us to know the worth and importance of Organ donation and transplantation. I'm thankful to the MOHAN foundation who gave us an opportunity to attend this session, helped to gain knowledge regarding organ donation and spread awareness." },
    { name: "Ms. Sanika Santosh Haldankar", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radD08F4.jpg", text: "Your Ambassador Training on the \"Gift of Life\" focusing on organ donation and transplantation was very impactful. The clarity with which you explained the process has helped us to understand it completely. Also, personal stories have enhanced our involvement and retention of information. You have inspired us to become donors or to support organ donation initiatives by your training. Overall, the presentation played an important role in effectively conveying the message of organ donation." },
    { name: "Mr. Shankar Ravindra Sawant", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radD2A97.jpg", text: "I have completed the online modules for organ donation. It was nice experience for me to learn many things about organ donation. Thanks to ‘MOHAN Foundation’ who gave us this great opportunity to gain knowledge about organ donation and become Ambassadors for its mission." },
    { name: "Mr. Shivprasad Tale", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radE046F.jpg", text: "I've completed an online training on organ donation and it was really helpful. Thanks a lot ' MOHAN Foundation'." },
    { name: "Ms. Pratiksha Gavit", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad01700.jpg", text: "I have completed the online modules to become an Ambassador for organ donation. It was a great training. I learn many things about organ donation and transplantation and you inspired us. I am thankful to MOHAN Foundation who gave this opportunity to attend the training." },
    { name: "Ms. Anita Parma Yadav", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radD7CF2.jpg", text: "I would like to thank the MOHAN FOUNDATION for conducting this training. I have completed the three modules of organ donation. It was easy and simple to understand. I learned a lot of things in these modules about organ donation. The session included so many videos which were very interesting and easy to understand. I am very thankful to the MOHAN Foundation and to my teachers who gave us an opportunity to attend this Ambassador training." },
    { name: "Mr. Sujit Chavan", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad1FFC4.jpg", text: "First I say thank you to the MOHAN foundation. It was very helpful to me and others also. I completed the training and learnt about organ donation. Once again thank you." },
    { name: "Ms. Pooja Tekam", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad73093.jpg", text: "I have completed the online module for Organ Donation organised by MOHAN Foundation. Everything was very detailed and very well explained in simple language which was very informative. Many videos and quizzes were also included to enhance our knowledge in the modules which made it very interesting and easy to understand. I gained insight about the myths and facts regarding organ donation, the actual procedure, method of organ donation, organs that can be donated etc about which I even as a nursing student did not know about. The Module 2 done via a zoom meeting was very interactive and they answered our questions in such a way that was easy to understand. The overall module and the zoom meetings were very helpful as I gained such amazing knowledge which I could share with others and even encourage many more to take initiative in organ donation. I was able to clear their myths as well which was new for me." },
    { name: "Mr. Abhay Botule", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radCF001.jpg", text: "I'm thankful to the MOHAN foundation for organising an online Ambassador training on organ donations. Videos are very helpful and knowledgeable. This helps us to improve our knowledge and to spread information in society." },
    { name: "Mr. Akash Chavhan", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radA3E3D.jpg", text: "I am thankful to MOHAN FOUNDATION for arranging this course called Ambassador training thorough the “Gift of Life”. I have completed all the modules and I found it very insightful and informative as I gained knowledge about various things which did not relate to organ donation. The whole module itself was very interesting as many videos and feedback from the families were also Included. This inspired me to help others. Now I am myself confident enough to share my knowledge and spread awareness about organ donation to all. Thank you MOHAN FOUNDATION." },
    { name: "Mr. Rathod Chandrakant", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad8CF32.jpg", text: "I am very thankful to MOHAN FOUNDATION for organising online training on organ donation. It is very helpful and knowledgeable. The overall module and the zoom meetings were very helpful as I gained such amazing knowledge." },
    { name: "Mr. Rathod Eshwar Ganpat", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad8FB02.jpg", text: "First of all I would like to thank MOHAN FOUNDATION for conducting this session and giving an opportunity to me and others. The session was taken online through the zoom platform. It was easy, simple and understandable. Before this session I had heard about organ donation. After attending all modules, I got to know a lot of things about donation, brain death and transplantation and counselling. I will share this information to everyone about organ donation. and encourage people to pledge to donate." },
    { name: "Ms. Ishwari Sanjay Pujare", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad576FF.jpg", text: "I have completed the online session \"Gift of Life\" on organ donation and transplantation as part of the Ambassador training. It was a great and very informative and engaging session. I learnt a lot because it had incredibly insightful content delivered in a very comprehensive way. It was well designed and valuable for anyone who wants to enhance their understanding about organ donation and transplantation. I will be able to carry the concepts learnt there going forward. Thank you to MOHAN FOUNDATION for a great session." },
    { name: "Ms. Anushka Dinesh More", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad42A6C.jpg", text: "I have completed the online session on organ donation and want to share the feedback. The module 2 zoom session and interactions with experts was very valuable in which various types of questions and queries were cleared effectively. Overall the sessions were helpful and definitely improved my understanding and implementing the importance of organ donation. A big thanks to MOHAN FOUNDATION." },
    { name: "Ms. Surabhi Rajesh Rane", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad6C706.jpg", text: "I have completed the course of Gift of Life by the MOHAN FOUNDATION. It was very helpful for us students to know the importance of organ donation and the complexities in the process of donation. By this training program we students have got the clear idea about organ donation so that we can be a part of such initiatives and also provide information about such initiatives to various people around us. I am again thankful to MOHAN foundation who gave us such a great opportunity of becoming Ambassadors of the cause." },
    { name: "Ms. Apurva Santosh Modhave", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad9A279.jpg", text: "I am very thankful to MOHAN FOUNDATION for organising an online session Ambassador training on organ donation. It was very knowledgeable and helpful for us. From the zoom meeting our doubts and queries got cleared. We got a lot of knowledge from this session. Thank you MOHAN Foundation." },
    { name: "Mr. Chaitanya Waghmare", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad7F841.jpg", text: "First of all, the lecture on the \"Gift of life\" module was very knowledgeable, I learnt new things about organ donation and transplantation. Overall, the module about organ donation and transplantation was informative and engaging. The topics covered are very important in aspects of organ donation. We can help others by being part of organ donation. The presenter was knowledgeable and conveyed the information clearly, making it easy to understand to all students. Thank you so much to 'Mohan foundation' for giving me the opportunity to be a part of your session. It was a really nice and good session." },
    { name: "Mr. Krushna Songire", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad76D94.jpg", text: "MOHAN Foundation's \"Gift of Life\" initiative on organ donation and transplantation is commendable. They provide vital information, support, and advocacy for individuals and families considering organ donation. Their efforts help raise awareness about the importance of organ donation and facilitate life-saving transplants, ultimately making a significant impact on saving lives and improving the quality of life for many." },
    { name: "Ms. Ankita Anand Nagolkar", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad8694E.jpg", text: "I have completed the online module of organ donation, it was a great session. I learned many things from this organ donation and transplantation and it was a knowledgeable session. I am thankful to the MOHAN Foundation who gave us the opportunity to attend the session." },
    { name: "Mr. Yashvant Mahadev Gite", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad3C96B.jpg", text: "I am very thankful to MOHAN FOUNDATION for organising online Ambassador Training on organ donation. It is very helpful and knowledgeable. The overall module and the zoom meetings were very meaningful. I gained such amazing knowledge." },
    { name: "Ms. Shrutika Sunil Raut", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad56998.jpg", text: "I have completed an online module for organ donations and I was able to gain knowledge about organ donations, processes and counseling. Session included interesting videos, presentation etc. The training helped us to know the worth and importance of donating organs. I'm thankful to the MOHAN Foundation for the opportunity to attend the sessions, helped to gain knowledge regarding organ donation and spread awareness." },
    { name: "Ms. Rutuj Charpilwar", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/radE9F6E.jpg", text: "I have completed the course i.e Gift of Life, Ambassador Training on organ donation. The course was made very interesting through modules and online zoom meetings which provided information on every aspect of organ donation. I am very grateful to MOHAN FOUNDATION for organising this course due to which I was able to gain such incredible knowledge which I could use to help many others who are in need." },
    { name: "Mr. Anil Nagargoje", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad7CA2C.jpg", text: "I am very thankful to MOHAN FOUNDATION for organising online training on organ donation. It is very helpful and knowledgeable. The overall module and the zoom meetings were interesting, inspiring and helpful. I gained such amazing knowledge." },
    { name: "Mr. Dipesh Patil", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad0667C.jpg", text: "I have completed the online training on organ donation and want to share the feedback. The zoom session was helpful in which various types of questions and queries were cleared effectively. Overall the sessions were helpful and will definitely assist me in implementing the importance of organ donation in the community." },
    { name: "Mr. Sachin Bade", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad0073D.jpg", text: "I am very thankful for the Ambassador Training module from MOHAN FOUNDATION. It is very helpful for me, the lecture and video modules helped to improve our knowledge regarding organ donation. It helped me to update my knowledge and use in our society and hospital setting." },
    { name: "Mr. Yash Mohan Vetal", location: "", image: "https://www.mohanfoundation.org/includes-rwd/images/rad4847E.jpg", text: "I have completed all three modules of Ambassador Training for organ donation. Both the trainee and the trainer gained from the interactions. It was a pleasant opportunity given by MOHAN Foundation to be a part of this training. Now it is easy to apply this information and provide knowledge in community, hospital, etc. Though it was an online session, all doubts were cleared. I am thankful and proudly said that I was part of this session and acquired full knowledge about organ donation." }
];

let currentFeedbackPage = 1;
const feedbackItemsPerPage = 6;

function toggleFeedbackText(button) {
    const p = button.previousElementSibling;
    const shortText = p.querySelector('.short-text');
    const fullText = p.querySelector('.full-text');
    
    shortText.classList.toggle('hidden');
    fullText.classList.toggle('hidden');

    if (button.innerText === "Read More") {
        button.innerText = "Read Less";
    } else {
        button.innerText = "Read More";
    }
}

function displayFeedback(page) {
    const container = document.getElementById('feedback-container');
    if (!container) return;
    container.innerHTML = '';

    const startIndex = (page - 1) * feedbackItemsPerPage;
    const endIndex = startIndex + feedbackItemsPerPage;
    const paginatedItems = allFeedbackData.slice(startIndex, endIndex);

    paginatedItems.forEach(item => {
        const uniqueId = `feedback-${Math.random().toString(36).substr(2, 9)}`;
        const card = document.createElement('div');
        card.className = 'pb-6 border-b border-slate-100 group';

        const textContent = item.text;
        const charLimit = 250;
        let feedbackHTML = '';
        let readMoreButton = '';

        if (textContent.length > charLimit) {
            const shortText = textContent.substring(0, charLimit);
            readMoreButton = `<button onclick="toggleFeedbackText(this)" class="text-sm font-bold text-mfblue hover:underline">Read More</button>`;
            feedbackHTML = `
                <p class="text-base text-black italic leading-relaxed mb-4">
                    <span class="short-text">${shortText}...</span>
                    <span class="full-text hidden">${textContent}</span>
                </p>
            `;
        } else {
            feedbackHTML = `<p class="text-base text-black italic leading-relaxed mb-6">${textContent}</p>`;
        }

        card.innerHTML = `
            ${feedbackHTML}
            ${readMoreButton}
            <div class="flex items-center gap-4 mt-4">
                <img src="${item.image}" class="w-10 h-10 rounded-full object-cover shrink-0 grayscale group-hover:grayscale-0 transition duration-300" alt="${item.name}">
                <div>
                    <h5 class="font-bold text-black text-sm">${item.name}</h5>
                    <span class="text-xs text-slate-500 font-medium block">${item.location}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function setupFeedbackPagination() {
    const container = document.getElementById('feedback-pagination');
    if (!container) return;
    container.innerHTML = '';
    const totalPages = Math.ceil(allFeedbackData.length / feedbackItemsPerPage);

    if (totalPages <= 1) return;

    const createButton = (content, page, isDisabled = false, isCurrent = false) => {
        const button = document.createElement('button');
        button.innerHTML = content;
        let baseClasses = 'w-9 h-9 rounded-full font-bold text-sm transition';
        if (isCurrent) {
            button.className = `${baseClasses} bg-mfblue text-white`;
            button.disabled = true;
        } else if (isDisabled) {
            button.className = `${baseClasses} bg-slate-100 text-slate-400 cursor-not-allowed opacity-50`;
            button.disabled = true;
        } else {
            button.className = `${baseClasses} bg-slate-100 hover:bg-mfblue hover:text-white`;
        }
        button.onclick = () => {
            currentFeedbackPage = page;
            displayFeedback(currentFeedbackPage);
            setupFeedbackPagination();
        };
        return button;
    };

    // First Button
    container.appendChild(createButton('<i class="fa-solid fa-angles-left text-xs"></i>', 1, currentFeedbackPage === 1));

    // Previous Button
    container.appendChild(createButton('<i class="fa-solid fa-chevron-left text-xs"></i>', currentFeedbackPage - 1, currentFeedbackPage === 1));

    // Ellipsis span
    const createEllipsis = () => {
        const ellipsis = document.createElement('span');
        ellipsis.innerText = '...';
        ellipsis.className = 'w-9 h-9 flex items-center justify-center text-slate-500';
        return ellipsis;
    };

    // Page Number Buttons
    const pageWindow = 2;
    let startPage = Math.max(1, currentFeedbackPage - pageWindow);
    let endPage = Math.min(totalPages, currentFeedbackPage + pageWindow);

    if (currentFeedbackPage - pageWindow <= 2) {
        endPage = Math.min(totalPages, 1 + (pageWindow * 2));
    }
    if (currentFeedbackPage + pageWindow >= totalPages - 1) {
        startPage = Math.max(1, totalPages - (pageWindow * 2));
    }

    if (startPage > 1) {
        container.appendChild(createButton('1', 1));
        if (startPage > 2) {
            container.appendChild(createEllipsis());
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        container.appendChild(createButton(i, i, false, i === currentFeedbackPage));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            container.appendChild(createEllipsis());
        }
        container.appendChild(createButton(totalPages, totalPages));
    }

    // Next Button
    container.appendChild(createButton('<i class="fa-solid fa-chevron-right text-xs"></i>', currentFeedbackPage + 1, currentFeedbackPage === totalPages));

    // Last Button
    container.appendChild(createButton('<i class="fa-solid fa-angles-right text-xs"></i>', totalPages, currentFeedbackPage === totalPages));
}

function setupFeedback() {
    displayFeedback(currentFeedbackPage);
    setupFeedbackPagination();
}

/**
 * Manages the Ambassador Stories section with search, sort, and pagination
 */
const allStoriesData = [
  {
    "title": "Ambassador creates impact full awareness on organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-creates-impact-full-awareness-on-organ-donation-12619.htm",
    "date": "2026-07-06",
    "description": "From June 1 st  to 30 th   2026, Organ Donation Ambassador Mrs Seema  Choudhury from Akhil Bharathiya Marwari Mahila Sammelan org...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12619-Seema.jpg"
  },
  {
    "title": "Organ Donation Awareness Desk at the Blood Donation Camp in Porvorim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Desk-at-the-Blood-Donation-Camp-in-Porvorim-Goa-12615.htm",
    "date": "2026-07-03",
    "description": "On 1 July 2026, Mr. Gabriel Pereira, Organ Donation Ambassador from the MOHAN Foundation, set up an Organ Donation Information Desk at a voluntary bl...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12615-G1.jpg"
  },
  {
    "title": "Organ Donation Ambassador Celebrated International yoga day with Organ Donation Awareness at Jamtha Grampanchayat, Nagpur",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-Celebrated-International-yoga-day-with-Organ-Donation-Awareness-at-Jamtha-Grampanchayat-Nagpur-12583.htm",
    "date": "2026-07-02",
    "description": "On June 21, 2026, International Yoga Day was celebrated at Jamtha Gram Panchayat, Nagpur, in collaboration with Zumba Club Shadow’s Miracle and...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12583-1.jpg"
  },
  {
    "title": "Organ donation Ambassador conduct awareness at senior citizen home",
    "link": "https://www.mohanfoundation.org/activities/Organ-donation-Ambassador-conduct-awareness-at-senior-citizen-home-12553.htm",
    "date": "2026-06-26",
    "description": "On 26th June 2026, an Organ and Eye Donation Awareness Session was conducted at Karaikal Ammaiyar Old Age Home by MOHAN Foundation for senior citizen...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12553-KA3.jpg"
  },
  {
    "title": "Directorate of Transport Staff Sensitised on Organ Donation, Porvorim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Directorate-of-Transport-Staff-Sensitised-on-Organ-Donation-Porvorim-Goa-12552.htm",
    "date": "2026-06-26",
    "description": "On June 25, 2026, Mr Gabriel Pereira, Organ Donation Ambassador from the MOHAN Foundation, conducted an interactive organ donation awareness session ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12552-g1.jpg"
  },
  {
    "title": "Manipal Hospitals, Goa, hosts CME on Organ Donation and End-of-Life Care, Dona Paula, Goa",
    "link": "https://www.mohanfoundation.org/activities/Manipal-Hospitals-Goa-hosts-CME-on-Organ-Donation-and-End-of-Life-Care-Dona-Paula-Goa-12551.htm",
    "date": "2026-06-26",
    "description": "On 24th June 2026, Manipal Hospitals Goa, in association with the Indian Society of Critical Care Medicine (ISCCM) Goa Chapter, organised a Continuin...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12551-G1.jpg"
  },
  {
    "title": "Senior Citizens Participate in Organ and Eye Donation Awareness Session at Annai Teresa Trust",
    "link": "https://www.mohanfoundation.org/activities/Senior-Citizens-Participate-in-Organ-and-Eye-Donation-Awareness-Session-at-Annai-Teresa-Trust-12542.htm",
    "date": "2026-06-24",
    "description": "On June 24, 2026, an Organ and Eye Donation Awareness Session was conducted at Annai Teresa Trust, Kilpauk, Chennai. The session was organized by MOH...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12542-AT2.jpg"
  },
  {
    "title": "Organ Donation Information Desk at Blood Donation Camp held at Wisdom Superspeciality Hospital, Miramar, Panjim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Information-Desk-at-Blood-Donation-Camp-held-at-Wisdom-Superspeciality-Hospital-Miramar-Panjim-Goa-12526.htm",
    "date": "2026-06-22",
    "description": "On June 20, 2026, Gabriel Pereira, Organ Donation Ambassador from the MOHAN Foundation, set up an organ donation information desk at the blood donati...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12526-G1.jpg"
  },
  {
    "title": "Module 2 of Ambassador Training conducted for Batch 46",
    "link": "https://www.mohanfoundation.org/activities/Module-2-of-Ambassador-Training-conducted-for-Batch-46-12522.htm",
    "date": "2026-06-20",
    "description": "The 46th batch of MOHAN Foundation's Organ Donation Ambassador Program successfully completed Module 2 on June 19, 2026. Fifteen &nbsp...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12522-2.png"
  },
  {
    "title": "Organ Donation Awareness Talk Conducted at the Goa Legislative Secretariat, June 16, 2026",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-Conducted-at-the-Goa-Legislative-Secretariat-June-16-2026-12525.htm",
    "date": "2026-06-15",
    "description": "On June 16, 2026, Mr Gabriel Pereira, Organ Donation Ambassador from the MOHAN Foundation, conducted an Organ Donation Awareness Talk for the officer...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12525-g1.jpg"
  },
  {
    "title": "Organ Donation Information Desk at Goenche Rakhandar Recognition Awards 2026",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Information-Desk-at-Goenche-Rakhandar-Recognition-Awards-2026-12524.htm",
    "date": "2026-06-14",
    "description": "On June 14, 2026, coinciding with World Blood Donor Day, Mr Gabriel Pereira, Organ Donation Ambassador from the MOHAN Foundation, was invited to set ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12524-P1.jpg"
  },
  {
    "title": "Blood Donation Camp and Organ Donation Awareness Activity at Mall De Goa, Porvorim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Blood-Donation-Camp-and-Organ-Donation-Awareness-Activity-at-Mall-De-Goa-Porvorim-Goa-12523.htm",
    "date": "2026-06-13",
    "description": "On June 13, 2026, Mr. Gabriel Pereira, Organ Donation Ambassador from the MOHAN Foundation (Multi Organ Hope and Advocacy Network), set up an Organ D...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12523-1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at Seminary Niwas, Duler, Mapusa, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-Seminary-Niwas-Duler-Mapusa-Goa-12505.htm",
    "date": "2026-06-12",
    "description": "On June 11, 2026, Mr. Gabriel Pereira, Organ Donation Ambassador of the MOHAN Foundation (Multi-Organ Hope and Advocacy Network), was invited to cond...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12505-G1.jpg"
  },
  {
    "title": "Promoting the Gift of Life: Organ Donation Information Desk at the Health Camp and Blood Donation Drive, Panjim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Promoting-the-Gift-of-Life-Organ-Donation-Information-Desk-at-the-Health-Camp-and-Blood-Donation-Drive-Panjim-Goa-12474.htm",
    "date": "2026-06-09",
    "description": "On 6th June 2026, Gabriel Pereira, Organ Donation Ambassador from the MOHAN Foundation, actively participated in the Health Camp and Blood Donation D...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12474-G1.jpg"
  },
  {
    "title": "The 45th batch of MOHAN Foundation's Organ Donation Ambassador Program",
    "link": "https://www.mohanfoundation.org/activities/The-45th-batch-of-MOHAN-Foundations-Organ-Donation-Ambassador-Program-12473.htm",
    "date": "2026-06-08",
    "description": "The 45th batch of MOHAN Foundation's Organ Donation Ambassador Program successfully completed Module 2 on June 6, 2026. Eleven motivated students fro...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12473-B1.png"
  },
  {
    "title": "Organ Donation ambassador conducts program at The International Naturopathy Organization",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-ambassador-conducts-program-at-The-International-Naturopathy-Organization-12464.htm",
    "date": "2026-06-05",
    "description": "The International Naturopathy Organization (INO), Odisha, successfully organizedthe Odisha Naturopathy and Integrative Wellness Summit (ONIWES) on 5 ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12464-AM1.jpg"
  },
  {
    "title": "44th Batch | Organ Donation Ambassador Training  Module 2",
    "link": "https://www.mohanfoundation.org/activities/44th-Batch-Organ-Donation-Ambassador-Training-Module-2-12441.htm",
    "date": "2026-05-30",
    "description": "The 44th batch of MOHAN Foundation's Organ Donation Ambassador virtual training successfully completed Module 2 on May 30, 2026. Twenty two motivated...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12441-MFM1 .jpg"
  },
  {
    "title": "Awareness Session on Organ Donation Conducted at New India Assurance, Fort, Mumbai",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-on-Organ-Donation-Conducted-at-New-India-Assurance-Fort-Mumbai-12440.htm",
    "date": "2026-05-29",
    "description": "An organ donation awareness session was conducted on May 7, 2026 at New India Assurance, Fort, Mumbai with the objective of educating the company sta...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12440-2.jpeg"
  },
  {
    "title": "Promoting Life Beyond Life: Organ Donation Information Desk at the Blood Donation Camp, Holy Family Church, Porvorim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Promoting-Life-Beyond-Life-Organ-Donation-Information-Desk-at-the-Blood-Donation-Camp-Holy-Family-Church-Porvorim-Goa-12299.htm",
    "date": "2026-04-27",
    "description": "An Organ Donation Information Desk was set up on Sunday, April 26, 2026, during the Blood Donation Camp organised by Holy Family Church, Porvorim, Go...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12299-PP1.jpg"
  },
  {
    "title": "Awareness Program at Food Corporation of India (FCI), Nandanagar, Agartala, West Tripura",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Program-at-Food-Corporation-of-India-FCI-Nandanagar-Agartala-West-Tripura-12295.htm",
    "date": "2026-04-27",
    "description": "On April 20, 2026, Mr. Biswajit Debbarma, Ambassador of MOHAN Foundation, Tripura, conducted an informative organ donation awareness session for the ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12295-T1.jpeg"
  },
  {
    "title": "Awareness Program on Organ Donation Conducted at Kumaribill Para under Lefunga RD Block",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Program-on-Organ-Donation-Conducted-at-Kumaribill-Para-under-Lefunga-RD-Block-12296.htm",
    "date": "2026-04-27",
    "description": "On April 22, 2026, an awareness program on organ donation was conducted by Mr. Biswajit Debbarma, Ambassador, Tripura, at Kumaribill Para for local r...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12296-T4.jpeg"
  },
  {
    "title": "A Gift of Life: Organ Donation Pledge Drive on Fr. Bolmax Pereiras 50th Birthday",
    "link": "https://www.mohanfoundation.org/activities/A-Gift-of-Life-Organ-Donation-Pledge-Drive-on-Fr-Bolmax-Pereiras-50th-Birthday-12284.htm",
    "date": "2026-04-25",
    "description": "On April 24, 2026, an organ donation pledging drive event was organised at St. Francis Xavier Church, Chicalim, Goa, on the occasion of the 50th birt...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12284-GG1.jpg"
  },
  {
    "title": "Module 2 of Organ Donation Ambassador Training conducted virtually",
    "link": "https://www.mohanfoundation.org/activities/Module-2-of-Organ-Donation-Ambassador-Training-conducted-virtually-12258.htm",
    "date": "2026-04-20",
    "description": "The 43rd batch of Organ Donation ambassador  virtual training was conducted on April18, 2026.  Ten motivated individuals from dif...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12258-Amby1.png"
  },
  {
    "title": "Organ Donation Awareness Talk at St Lawrence High School, Agassaim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-St-Lawrence-High-School-Agassaim-Goa-12260.htm",
    "date": "2026-04-20",
    "description": "An informative and engaging awareness session on organ donation was conducted at St. Lawrence High School, Agassaim, Goa, on April 17, 2026. The sess...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12260-G1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at Our Lady of Mount Carmel, High School, Arambol, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-Our-Lady-of-Mount-Carmel-High-School-Arambol-Goa-12262.htm",
    "date": "2026-04-20",
    "description": "An organ donation awareness session was successfully conducted on April 16, 2026, at Our Lady of Mount Carmel High School, Arambol, Goa. Mr Gabriel P...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12262-Gab1.jpg"
  },
  {
    "title": "MOHAN Foundation Ambassador conducted awareness session at ITCT School, Tripura",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-Ambassador-conducted-awareness-session-at-ITCT-School-Tripura-12264.htm",
    "date": "2026-04-20",
    "description": "On April 10, 2026, Mr. Biswajit Debbarma, Ambassador of MOHAN Foundation for Tripura, delivered a talk on organ donation to the parents and staff of ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12264-tip1.jpeg"
  },
  {
    "title": "Organ Donation Awareness Talk on World Homoeopathy Day, Bandora, Ponda, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-on-World-Homoeopathy-Day-Bandora-Ponda-Goa-12252.htm",
    "date": "2026-04-17",
    "description": "An organ donation awareness session was conducted on April 12, 2026, on the occasion ofWorld Homoeopathy Day, by Homoeopathic Medical Association of ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12252-p1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at Fr Agnel Higher Secondary School, Pilar, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-Fr-Agnel-Higher-Secondary-School-Pilar-Goa-12251.htm",
    "date": "2026-04-16",
    "description": "An informative and engaging talk on organ donation was conducted on April 13, 2026, at Fr Agnel Higher Secondary School, Pilar, Goa. The session was ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12251-p1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at Patriarchal Seminary of Rachol, Rachol, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-Patriarchal-Seminary-of-Rachol-Rachol-Goa-12236.htm",
    "date": "2026-04-11",
    "description": "An organ donation awareness session was conducted on April 9, 2026, at the Patriarchal Seminary of Rachol by Gabriel Pereira, an organ donation ambas...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12236-PP1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk held at St Thomas Higher Secondary School, Aldona, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-held-at-St-Thomas-Higher-Secondary-School-Aldona-Goa-12219.htm",
    "date": "2026-04-09",
    "description": "An organ donation awareness talk was conducted on April 7, 2026, at St. Thomas Higher Secondary School. The session aimed to educate students about t...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12219-School01.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at Shri Kamaxidevi Homoeopathic Medical College & Hospital, Shiroda, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-Shri-Kamaxidevi-Homoeopathic-Medical-College-Hospital-Shiroda-Goa-12223.htm",
    "date": "2026-04-09",
    "description": "On April 6, 2026, an organ donation awareness session was conducted for the faculty of Shri Kamaxidevi Homoeopathic Medical College & Hospital, S...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12223-College1.jpg"
  },
  {
    "title": "Ambassadors speak to their teachers about organ donation at KC High School",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-speak-to-their-teachers-about-organ-donation-at-KC-High-School-12154.htm",
    "date": "2026-03-28",
    "description": "Teachers from KC High School in Chennai attended an organ donation awareness workshop on March 25, led by organ donation ambassadors Ms. Krisha ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12154-KC1.jpg"
  },
  {
    "title": "Organ Donation Information Desk at Auxilium Primary School, Carona, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Information-Desk-at-Auxilium-Primary-School-Carona-Goa-12107.htm",
    "date": "2026-03-17",
    "description": "On Sunday, March 15, 2026, Mr. Gabriel Pereira, an Organ Donation Ambassador representingthe MOHAN Foundation, established an organ donation informat...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12107-Picture1.jpg"
  },
  {
    "title": "Organ Donation Ambassador conducts an Awareness at Meyyur Village",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-conducts-an-Awareness-at-Meyyur-Village-12108.htm",
    "date": "2026-03-17",
    "description": "On March 12,  2026 Organ Donation Ambassador Mahesh Waran organized an organ and tissue donation awareness talk. The audience were &nb...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12108-meyyur1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at Assagao, Bardez, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-Assagao-Bardez-Goa-12094.htm",
    "date": "2026-03-16",
    "description": "On Sunday, March 8, 2026, Mr. Gabriel Pereira, an Organ Donation Ambassador for the MOHAN Foundation, delivered a talk on organ donation in partnersh...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12094-Pic1.jpg"
  },
  {
    "title": "Organ Donation Talk at Clube Tennis De Gaspar Dias, Panjim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Talk-at-Clube-Tennis-De-Gaspar-Dias-Panjim-Goa-12095.htm",
    "date": "2026-03-16",
    "description": "On Saturday, March 7, 2026, Mr. Gabriel Pereira, Organ Donation Ambassador for MOHANFoundation, delivered a talk on organ donation at Clube Tennis De...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12095-Photo1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at the Cyclothon on World Kidney Day, Aquem, Margao, Goa.",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-the-Cyclothon-on-World-Kidney-Day-Aquem-Margao-Goa-12091.htm",
    "date": "2026-03-14",
    "description": "On Sunday, March 8, 2026, Mr. Gabriel Pereira, the Organ Donation Ambassador for the MOHAN Foundation, was invited to deliver a talk to cyclists part...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12091-Picture1.jpg"
  },
  {
    "title": "Organ Donation Talk at Saligao Institute, Saligao, Bardez, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Talk-at-Saligao-Institute-Saligao-Bardez-Goa-12039.htm",
    "date": "2026-03-03",
    "description": "An informative and inspiring talk on organ donation was held at the Saligao Institute in Bardez, Goa, on March 1, 2026, by Mr Gabriel Pereira, an Org...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12039-Gabriel1.jpg"
  },
  {
    "title": "Organ Donation Awareness Session at Sethu - Centre for Child Development and Family Guidance, Saligao, Goa.",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Session-at-Sethu-Centre-for-Child-Development-and-Family-Guidance-Saligao-Goa-12040.htm",
    "date": "2026-03-03",
    "description": "On Friday, February 27, 2026, Mr Gabriel Pereira, an Organ Donation Ambassador for the MOHAN Foundation, conducted an organ donation awareness sessio...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12040-Gabriel2.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at the Meeting of Priests of Siolim Deanery, Siolim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-the-Meeting-of-Priests-of-Siolim-Deanery-Siolim-Goa-12027.htm",
    "date": "2026-03-01",
    "description": "On February 9, 2026, Mr. Gabriel Pereira, Organ Donation Ambassador for MOHAN Foundation, delivered an awareness talk on organ donation at Mae de Deu...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12027-Gabriel3.jpg"
  },
  {
    "title": "Organ Donation Information Desk at the Blood Donation Camp  St. Britto High School, Mapusa, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Information-Desk-at-the-Blood-Donation-Camp-St-Britto-High-School-Mapusa-Goa-12011.htm",
    "date": "2026-02-26",
    "description": "On February 25, 2026, Mr. Gabriel Pereira, Organ Donation Ambassador from the MOHAN Foundation, set up an organ donation information desk at the bloo...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12011-Picture No. 1.jpg"
  },
  {
    "title": "Organ Donation Information Desk at the Blood Donation Camp organised by Mapusa Youth in Mapusa, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Information-Desk-at-the-Blood-Donation-Camp-organised-by-Mapusa-Youth-in-Mapusa-Goa-12010.htm",
    "date": "2026-02-25",
    "description": "On Thursday, February 19, 2026, Mr Gabriel Pereira, an Organ Donation Ambassador for the MOHAN Foundation, set up an organ donation information desk ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12010-G1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at St Anthonys High School, Guirim, Mapusa, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-St-Anthonys-High-School-Guirim-Mapusa-Goa-12005.htm",
    "date": "2026-02-23",
    "description": "On Friday, February 20, 2026, Mr Gabriel Pereira, an Organ Donation Ambassador for the MOHAN Foundation, conducted an informative session on organ do...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12005-Picture No1.jpg"
  },
  {
    "title": "Ambassador Biswajit Debbarma (Tripura) represented MOHAN Foundation and conducted the awareness talk at Kalinagar High School",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Biswajit-Debbarma-Tripura-represented-MOHAN-Foundation-and-conducted-the-awareness-talk-at-Kalinagar-High-School-12006.htm",
    "date": "2026-02-23",
    "description": "On January 21, 2026, an awareness program on organ donation was organised at Kalinagar High School, West Tripura. The objective of the program was to...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/12006-Thirupura1.jpeg"
  },
  {
    "title": "Organ Donation Talk at Srinivassa Sinai Dempo College (Autonomous), Cujira, Bambolim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Talk-at-Srinivassa-Sinai-Dempo-College-Autonomous-Cujira-Bambolim-Goa-11995.htm",
    "date": "2026-02-20",
    "description": "On Thursday, February 12, 2026, Mr Gabriel Pereira, an Organ Donation Ambassador for MOHAN Foundation, was invited to deliver an organ donation aware...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11995-Gabriel1.jpg"
  },
  {
    "title": "Batch 42 of Ambassadors complete their training",
    "link": "https://www.mohanfoundation.org/activities/Batch-42-of-Ambassadors-completetheir-training-11988.htm",
    "date": "2026-02-16",
    "description": "On February 7, 2026, the 42nd group of organ donation advocates was trained by the MOHAN Foundation. Thirteen committed volunteers participated in th...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11988-1.png"
  },
  {
    "title": "Organ Donation Information Desk at Holy Cross High School, Bastora, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Information-Desk-at-Holy-Cross-High-School-Bastora-Goa-11978.htm",
    "date": "2026-02-12",
    "description": "On Saturday, February 7, 2026, Mr Gabriel Pereira, an Organ Donation Ambassador for the MOHAN Foundation, set up an organ donation information desk a...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11978-1.jpg"
  },
  {
    "title": "Ambassadors of Pupil International School create awareness through Multiple Media",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-of-Pupil-International-School-create-awareness-through-Multiple-Media-11971.htm",
    "date": "2026-02-09",
    "description": "On February 3, 2026, the Organ Donation Ambassadors of Pupil International School invited Dr. Sunil Shroff, Managing Trustee of MOHAN Foundation, as the Chief Guest, along with the MOHAN Foundation team. The programme began with a brief introduction of the gathering, followed by the inauguration of the school’s new club, GOAL – Gift of a Life.   The event was attended by approximately 280 students, parents, and teachers. The students opened the programme with a meaningful song on organ donation, setting an emotional tone. This was followed by the screening of a short film created by the students on Hithendran’s life story, highlighting the importance and impact of organ donation.   Subsequently, the students presented a powerful performance explaining what happens to the body and organs after brain death, effectively conveying key messages in a simple and impactful manner.   This was followed by an inspiring talk by Mr. Hariharan, a kidney recipient, who shared his life journey and motivated students to understand the importance of organ donation and the life-changing impact it has on recipients and their families.   Later, Dr. Sunil Shroff addressed the students and parents, emphasizing the growing need for organ donation in the present times due to changing lifestyles and increasing organ failure cases.   As a token of appreciation, the chief guests Dr. Sunil Shroff, Dr. Hemal Kanvinde, and Mr. Hariharan were presented with paintings created by the students on the theme of organ donation. Certificates of completion of the Ambassador Training were awarded to 25 students.   The programme concluded with the formal presentation of badges to Kreshetha and Tanvi, the President and Secretary of the GOAL club respectively, followed by an organ donation pledge and the National Anthem. MOHAN Foundation thanks Director – Dr Saveetha for the opportunity and collaboration in promoting organ donation awareness.    Program Links :https:...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11971-Ambpro1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at Jesus, Mary and Joseph Church, Nuvem, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-Jesus-Mary-and-Joseph-Church-Nuvem-Goa-11912.htm",
    "date": "2026-02-02",
    "description": "On Sunday, February 1, 2026, Mr. Gabriel Pereira, an Organ Donation Ambassador with the MOHAN Foundation, delivered an inspiring awareness talk on or...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11912-1.jpg"
  },
  {
    "title": "Organ donation ambassador promotes the cause in Medical conference",
    "link": "https://www.mohanfoundation.org/activities/Organ-donation-ambassador-promotes-the-cause-in-Medical-conference-11922.htm",
    "date": "2026-02-02",
    "description": "The Indian Medical Association (IMA), Chandrapur, successfully organized CIMACON XIII on January 24 and 25, 2026, under the inspiring theme “Up...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11922-Pic.24.My Vibe saving lives Budges distribute to delegates.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at St. Elizabeth Church, Ucassaim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-St-Elizabeth-Church-Ucassaim-Goa-11857.htm",
    "date": "2026-01-19",
    "description": "On January 11, 2026, Mr. Gabriel Pereira, an Organ Donation Ambassador for MOHAN Foundation, delivered an organ donation awareness talk to members of...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11857-PHOTO111.jpg"
  },
  {
    "title": "Organ Donation Information Desk at NoMoZo 7.0, Porvorim, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Information-Desk-at-NoMoZo-70-Porvorim-Goa-11858.htm",
    "date": "2026-01-19",
    "description": "On January 11, 2026, the MOHAN Foundation hosted an organ donation information desk at NoMoZo 7.0 in Porvorim, Goa. NoMoZo 7.0 (No Motor Zone) is a v...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11858-Photo1.jpg"
  },
  {
    "title": "Organ Donation Information Desk at Lourdes Convent High School, Saligao, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Information-Desk-at-Lourdes-Convent-High-School-Saligao-Goa-11859.htm",
    "date": "2026-01-19",
    "description": "On January 17, 2026, Mr. Gabriel Pereira, Organ Donation Ambassador for MOHAN Foundation, set up an organ donation information desk at a blood donati...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11859-School1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at St. Jerome Church, Mapusa, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-St-Jerome-Church-Mapusa-Goa-11860.htm",
    "date": "2026-01-19",
    "description": "On January 4, 2026, Mr. Gabriel Pereira, an Organ Donation Ambassador from MOHAN Foundation, delivered an organ donation awareness talk to the Parish...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11860-01.jpg"
  },
  {
    "title": "MOHAN Foundation conducts a workshop on Become an Ambassador for Organ Donation at Tamil Nadu Government Multi-Specialty Hospital, Omandurar",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-conducts-a-workshop-on-Become-an-Ambassador-for-Organ-Donation-at-Tamil-Nadu-Government-Multi-Specialty-Hospital-Omandurar-11844.htm",
    "date": "2026-01-12",
    "description": "On January 9, 2026 MOHAN Foundation was invited to conduct a two-hour workshop titled “Become an Ambassador for Organ Donation”&nbsp...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11844-omandurarWS1.jpg"
  },
  {
    "title": "Angels of Change Workshop at The Pupil International School, Chennai",
    "link": "https://www.mohanfoundation.org/activities/Angels-of-Change-Workshop-at-The-Pupil-International-School-Chennai-11761.htm",
    "date": "2025-12-26",
    "description": "MOHAN Foundation conducted Organ Donation Ambassador training for 25 students  of The Pupil International School on Dec 12, 2025. The workshop b...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11761-Pupilshl1.jpg"
  },
  {
    "title": "MOHAN Foundation Organises Two-day Angles of Change Volunteer Training Workshop at ILS Nursing Institute, Agartala, Tripura",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-Organises-Two-day-Angles-of-Change-Volunteer-Training-Workshop-at-ILS-Nursing-Institute-Agartala-Tripura-11718.htm",
    "date": "2025-12-13",
    "description": "On December 8 and 9, 2025, MOHAN Foundation organised a two day Angles of Change Volunteer Training workshop at ILS Nursing Institute, Agartala, West...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11718-angels.jpg"
  },
  {
    "title": "Organ Donation Ambassador training conducted over zoom",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-training-conducted-over-zoom-11651.htm",
    "date": "2025-11-27",
    "description": "Volunteers known as organ donation ambassadors work to raise public awareness of tissue and organ donation. On November 22, 2025, MOHAN Foundation he...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11651-Picture1.png"
  },
  {
    "title": "Awareness Talk on Organ Donation at Adani Cement, Mines,  Darlaghat, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan Session-2",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Adani-Cement-Mines-Darlaghat-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-Session-2-11603.htm",
    "date": "2025-11-03",
    "description": "On 18th October 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Adani Cement, Mines, D...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11603-1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Jail Training School karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Jail-Training-School-karnal-Haryana-11597.htm",
    "date": "2025-11-03",
    "description": "On 20th October 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11597-1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Gian Bharti College of Education karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Gian-Bharti-College-of-Education-karnal-Haryana-11598.htm",
    "date": "2025-11-03",
    "description": "O   0n 24th October 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11598-1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at R.L. College of Education karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-RL-College-of-Education-karnal-Haryana-11599.htm",
    "date": "2025-11-03",
    "description": "On 25th October 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11599-session -1 Dr. Neena speaking about Organ donation at R.L college of education Haryana on 25th October 2025.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at R.L. College of Education karnal, Haryana Session-2",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-RL-College-of-Education-karnal-Haryana-Session-2-11600.htm",
    "date": "2025-11-03",
    "description": "On 26th October 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11600-session -2 Dr. Neena speaking about Organ donation at R.L college of education Haryana on 26th October 2025.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at R.L. College of Education karnal, Haryana Session-3",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-RL-College-of-Education-karnal-Haryana-Session-3-11601.htm",
    "date": "2025-11-03",
    "description": "On 27th October 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11601-session -3 Dr. Neena speaking about Organ donation at R.L college of education Haryana on 27th October 2025.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at R.L. College of Education karnal, Haryana Session-4",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-RL-College-of-Education-karnal-Haryana-Session-4-11602.htm",
    "date": "2025-11-03",
    "description": "On 27th October 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11602-session -4 Dr. Neena speaking about Organ donation at R.L college of education Haryana on 27th October 2025.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Adani Cement, Mines,  Darlaghat, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Adani-Cement-Mines-Darlaghat-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-11595.htm",
    "date": "2025-11-02",
    "description": "On 15th October 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Adani Cement, Mines, D...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11595-1.jpg"
  },
  {
    "title": "Diwali edition of a vernacular magazine dedicated to Organ Donation.",
    "link": "https://www.mohanfoundation.org/activities/Diwali-edition-of-a-vernacular-magazine-dedicated-to-Organ-Donation-11561.htm",
    "date": "2025-10-24",
    "description": "Ambassador Parkash Bapat of Pune during a talk on organ donation in Pune, impressed his audience with the clarity  on organ donat...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11561-Changulpanachi chalval - beautiful article 1st page.jpg"
  },
  {
    "title": "Ambassador  in Pune conducts an awareness campaign on World Heart Day.",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-in-Pune-conducts-an-awareness-campaign-on-World-Heart-Day-11562.htm",
    "date": "2025-10-24",
    "description": "Organ Donation Ambassador Dr Pravin Patil conducted an awareness campaign on World Heart Day.  This awareness program was conducted for two seni...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11562-A Happy group picture with participants.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana Session-7",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-7-11515.htm",
    "date": "2025-10-03",
    "description": "On 22nd September 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11515-image1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Government College, Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Government-College-Karnal-Haryana-11514.htm",
    "date": "2025-10-03",
    "description": "On 10th September 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11514-image1.jpg"
  },
  {
    "title": "MOHAN Foundation conducts training for Organ Donation Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-conducts-training-for-Organ-Donation-Ambassadors-11488.htm",
    "date": "2025-09-30",
    "description": "On September 27, 2025, the 37th class of Organ Donation Ambassadors was trained. Seven ambassador trainees participated in the online course. After p...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11488-1  Interaction with experts.jpg"
  },
  {
    "title": "Ambassadosr participates in the Miles for Sight Cyclothon, Mumbai",
    "link": "https://www.mohanfoundation.org/activities/Ambassadosr-participates-in-the-Miles-for-Sight-Cyclothon-Mumbai-11465.htm",
    "date": "2025-09-23",
    "description": "To raise awareness about the critical need for eye donation and vision restoration, the Shantilal Shanghvi Eye Institute (SSEI), organised its &lsquo...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11465-image1new.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Dabur India Limited, Baddi Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Dabur-India-Limited-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-11387.htm",
    "date": "2025-09-02",
    "description": "On 29th August 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Dabur India Limited, Ba...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11387-image1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Shakuntala Devi Foundation, Beauty Culture Toga Village, Punjab by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Shakuntala-Devi-Foundation-Beauty-Culture-Toga-Village-Punjab-by-Ambassador-Mrs-Parveen-Mahajan-11386.htm",
    "date": "2025-09-02",
    "description": "On 2 nd  August 2025, On the Occasion of Organ Donation Day Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session on organ d...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11386-image1.jpg"
  },
  {
    "title": "Organ Donation Ambassador at the NAB, Bengaluru",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-at-the-NAB-Bengaluru-11377.htm",
    "date": "2025-09-01",
    "description": "Mr Anant Acharya, Organ Donation Ambassador  spoke to children at the National Association of Blind (NAB) in Bengaluru on Aug 15, 2025. More tha...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11377-image1.jpg"
  },
  {
    "title": "Banner Unveiled: Donate Organs, Save Lives at Mapusa Municipal Council, Mapusa, Goa  August 1, 2025",
    "link": "https://www.mohanfoundation.org/activities/Banner-Unveiled-Donate-Organs-Save-Lives-at-Mapusa-Municipal-Council-Mapusa-Goa-August-1-2025-11302.htm",
    "date": "2025-08-08",
    "description": "On August 1, 2025, Mr. Gabriel Pereira, Organ Donation Ambassador with the MOHAN Foundation, unveiled a banner reading “Donate Organs, Save Liv...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11302-Gabriel felicitating the chairperson.jpg"
  },
  {
    "title": "Ambassador runs at the SAO Run, Bangalore",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-runs-at-the-SAO-Run-Bangalore-11304.htm",
    "date": "2025-08-08",
    "description": "The second edition of the SAP Run Bangalore, themed #EveryStepMatters, took place on August 3rd, 2025, at the Karnataka Trade Promotion Organisation ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11304-1000638096.jpg"
  },
  {
    "title": "Organ Donation Ambassador creates awareness through  various competitions and activities in Odisha",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-creates-awareness-through-various-competitions-and-activities-in-Odisha-11299.htm",
    "date": "2025-08-06",
    "description": "Ms. Seema  Choudhury (Member - Akhil Bhartiya Marwari Mahila Sammelan) an ambassador of MOHAN Foundation created impactful awareness with h...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11299-Lantern-Festival.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at B.R.M. College of Education, Gharaunda, Karnal",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-BRM-College-of-Education-Gharaunda-Karnal-11264.htm",
    "date": "2025-08-02",
    "description": "On 2 nd  July 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11264-newspaper coverage.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Doon Valley College of Education, Gharaunda, Karnal",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Doon-Valley-College-of-Education-Gharaunda-Karnal-11266.htm",
    "date": "2025-08-02",
    "description": "On 7th July 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First Ai...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11266-Dr Neena speaking about Organ donation (2).jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at EPL Ltd. Nalagarh, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-EPL-Ltd-Nalagarh-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-11262.htm",
    "date": "2025-08-02",
    "description": "On 12th July 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of EPL Ltd. Nalagarh, Himach...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11262-Mrs Parveen Mahajan speaking about organ donation.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Auro Vardhman Baddi, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Auro-Vardhman-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-11263.htm",
    "date": "2025-08-02",
    "description": "On 17th July 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Auro Vardhman Baddi,Himac...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11263-Mrs Parveen Mahajan speaking about organ donation at Auro Vardhman Baddi.jpg"
  },
  {
    "title": "Ambassador speaks to family and friends about saving lives through organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-speaks-to-family-and-friends-about-saving-lives-through-organ-donation-11231.htm",
    "date": "2025-07-28",
    "description": "On 16th July,  Organ Donation Ambassador Ms Shloka Reddy conducted an online  talk on something very important and a topic that i...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11231-Ms Shloka speaking organ donation.png"
  },
  {
    "title": "Organ Donation awareness at Thulasi Law College, Tirunelveli",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-awareness-at-Thulasi-Law-College-Tirunelveli-11232.htm",
    "date": "2025-07-28",
    "description": "Organ Donation Ambassador Mr. Sam Vikash, approached Thulsai College of Law, Tirunelveli and organized an awareness talk about Organ Donation on July...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11232-Mr  Ganesh talking about organ donation.jpeg"
  },
  {
    "title": "Organ health and donation talk at St. Joseph's Matriculation School, Poonamallee",
    "link": "https://www.mohanfoundation.org/activities/Organ-health-and-donation-talk-at-St-Josephs-Matriculation-School-Poonamallee-11203.htm",
    "date": "2025-07-16",
    "description": "On July 16, 2025 a health awareness program was organized at St. Joseph's Matriculation Higher Secondary School, Poonamallee, Chennai. This session w...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11203-Joseph School 1.jpg"
  },
  {
    "title": "Awareness on Organ Health at Vivekananda Vidyalaya Matriculation School",
    "link": "https://www.mohanfoundation.org/activities/Awareness-on-Organ-Health-at-Vivekananda-Vidyalaya-Matriculation-School-11156.htm",
    "date": "2025-07-03",
    "description": "Ms. Merlin. P Intern, from Nazareth College of Arts & Science as a part of her Organ Donation Ambassador programme, organized an awareness sessio...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11156-Mr Ganesh talking about MOHAN Foundation.jpeg"
  },
  {
    "title": "Students of DAV Public School, Chennai  enjoy a session on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Students-of-DAV-Public-School-Chennai-enjoy-a-session-on-Organ-Donation-11153.htm",
    "date": "2025-07-03",
    "description": "An organ donation awareness session was conducted at DAV Public School (DAVPS) Velachery Chennai  on July 1, 2025 at 2.00pm. Ms S...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11153-Ms Keerthana Intern talks about organ donation.jpeg"
  },
  {
    "title": "Students of DAV Public School, Chennai  enjoy a session on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Students-of-DAV-Public-School-Chennai-enjoy-a-session-on-Organ-Donation-11153.htm",
    "date": "2025-07-03",
    "description": "An organ donation awareness session was conducted at DAV Public School (DAVPS) Velachery Chennai  on July 1, 2025 at 2.00pm. Ms S...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11153-DAV Public School-Pic 1..jpeg"
  },
  {
    "title": "MOHAN Foundation ambassador write blog on organ donation",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-ambassador-write-blog-on-organ-donation-11154.htm",
    "date": "2025-07-03",
    "description": "As part of the organ donation awareness initiative, Raghav Badrinath successfully completed his activity by writing a detailed and informative blog on the subject. The blog provides a comprehensive overview of how organ donation works in India, covering key aspects such as eligibility, the donation process, relevant regulations, and how medical professionals match donated organs with recipients. To maximize outreach and impact, Raghav shared the blog widely across various social media platforms, actively encouraging friends and followers to read, share, and engage with the content. The post received a positive response, reflected in a significant number of views (104), likes, and comments, indicating growing interest and awareness about organ donation among his network. This initiative has contributed meaningfully to spreading the message of the MOHAN Foundation and inspiring more people to learn about and consider organ donation.  Below is the link of the blog: https:...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11154-Mr Raghav Badrinath ambassador of MOHAN Foundation.png"
  },
  {
    "title": "Ambassador Raghav of Bengaluru created posters to promote organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Raghav-of-Bengaluru-created-posters-to-promote-organ-donation-11155.htm",
    "date": "2025-07-03",
    "description": "Ambassador Raghav of Bengaluru created posters to promote organ donation and put them on his instagram account as well shared  on his mothe...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11155-Around 159 viewers  seen the poster.png"
  },
  {
    "title": "Ambassador Dr. Neena Conducted an Awareness Talk at Nirmal Dham Old Age home, Karnal Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-Conducted-an-Awareness-Talk-at-Nirmal-Dham-Old-Age-home-Karnal-Haryana-11142.htm",
    "date": "2025-07-01",
    "description": "On 15th June 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11142-Dr Neena speaking about Organ donation helpline at Nirmal Dham Old Age Home.jpg"
  },
  {
    "title": "Ambassador Dr. Neena Conducted an Awareness Talk at Good rich Cereals Company, Nagla, Karnal Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-Conducted-an-Awareness-Talk-at-Good-rich-Cereals-Company-Nagla-Karnal-Haryana-11141.htm",
    "date": "2025-07-01",
    "description": "On 4th June 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First Ai...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11141-Dr Neena speaking about Organ donation at Good rich Cereals  Nagla Karnal.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Godrej Consumer Ltd. Kattha, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Godrej-Consumer-Ltd-Kattha-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-11138.htm",
    "date": "2025-07-01",
    "description": "On 11th June 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Godrej Consumer Ltd. Katt...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11138-Mrs Parveen Mahajan speaking about organ donation.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Dr Reddys Laboratories, Baddi Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Dr-Reddys-Laboratories-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-11137.htm",
    "date": "2025-07-01",
    "description": "On 4th June 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Dr. Reddy’s Laborato...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11137-Mrs Parveen Mahajan speaking about organ donation.jpg"
  },
  {
    "title": "Ambassador speaks to members of Konambedu Self Help Group, Avadi",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-speaks-to-members-of-Konambedu-Self-Help-Group-Avadi-11114.htm",
    "date": "2025-06-23",
    "description": "Ms. Sandhiyashree GK, Intern at MOHAN Foundation and an Organ Donation Ambassador, organized an awareness session on Organ Donation and Transplantati...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11114-Ms Sandhiyashree explains the concept of organ donation.jpg"
  },
  {
    "title": "Ambassador speaks  about organ donation to students in Pakkam, Tiruvallur",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-speaks-about-organ-donation-to-students-in-Pakkam-Tiruvallur-11115.htm",
    "date": "2025-06-23",
    "description": "Ms. Yogashree M, Intern at MOHAN Foundation and Organ Donation Ambassador, organized an awareness session on organ donation on June 21, 2025. The awa...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11115-Ms Yogashree explains the concept of organ donation.jpg"
  },
  {
    "title": "Organ Donation Ambassador delivers an online awareness talk in Tamil Nadu",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-delivers-an-online-awareness-talk-in-Tamil-Nadu-11116.htm",
    "date": "2025-06-23",
    "description": "Organ Donation Ambassador Ms Divyapradha organised an online awareness on Monday, June 22, 2025. The meeting was conducted on Google Meet  ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11116-Ms. Divyapradha expalins the concept of organ donation.png"
  },
  {
    "title": "Organ donation ambassador conducts and online session to spread awareness",
    "link": "https://www.mohanfoundation.org/activities/Organ-donation-ambassador-conducts-and-online-session-to-spread-awareness-11092.htm",
    "date": "2025-06-10",
    "description": "On June 6, 2025 Ms Sana Malhotra Organ Donation Ambassador  from Chennai organized and connected at talk on organ donation. The audience wa...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11092-image1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at R. L Law college, Davangere",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-R-L-Law-college-Davangere-11070.htm",
    "date": "2025-06-04",
    "description": "On 17th May 2025, Dr. Shilpashree,  Organ Donation Ambassador, MOHAN Foundation, conducted an  awareness session for the Law...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11070-Dr.Shilpashree speaks about the concept of organ donation.jpeg"
  },
  {
    "title": "Organ donation Ambassador sets an information desk at IIM Bangalore alumni meeting",
    "link": "https://www.mohanfoundation.org/activities/Organ-donation-Ambassador-sets-an-information-desk-at-IIM-Bangalore-alumni-meeting-11071.htm",
    "date": "2025-06-04",
    "description": "On May 31st, 2025,  MOHAN Foundation organ donation ambassador Ms.Rashmi Raj set an information desk at an alumni meeting of IIM Bangalore ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11071-Mr. Ujjawal and Ms. Jyothi Galada support organ donation.jpeg"
  },
  {
    "title": "Organ Donation Ambassador creates awareness at Bengaluru",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-creates-awareness-at-Bengaluru-11072.htm",
    "date": "2025-06-04",
    "description": "Mr. Anant Acharya, ambassador of MOHAN Foundation and a kidney  transplant recipient has created an impactful awareness on organ donation i...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11072-Mr Anant Acharya custome for the run.jpeg"
  },
  {
    "title": "Ambassador from Odisha creates Impactful Organ Donation Awareness",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-from-Odisha-creates-Impactful-Organ-Donation-Awareness-11065.htm",
    "date": "2025-06-03",
    "description": "From November 2024 to May 2025, Organ Donation Ambassador Mrs Seema  Choudhury from Akhil Bharathiya Marwari Mahila Sammelan organized seve...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11065-Mrs Seema and her team distributing pampletes in Market.jpeg"
  },
  {
    "title": "Ambassador from Odisha creates Impactful Organ Donation Awareness",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-from-Odisha-creates-Impactful-Organ-Donation-Awareness-11065.htm",
    "date": "2025-06-03",
    "description": "From November 2024 to May 2025, Organ Donation Ambassador Mrs Seema  Choudhury from Akhil Bharathiya Marwari Mahila Sammelan organized seve...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11065-Mrs Seema and her team distributing pampletes in Market.jpeg"
  },
  {
    "title": "Ambassador runs a half marathon to promote organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-runs-a-half-marathon-to-promote-organ-donation-11068.htm",
    "date": "2025-06-03",
    "description": "On 12th February 2025, The House of Hiranandani successfully conducted the 11 th  edition of  the Thane half marathon. Over 14,00...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11068-Mr Ravi Vijaykumar Shinde participated in 10 KM run.jpeg"
  },
  {
    "title": "MOHAN Foundation conducts Organ Donation Ambassadors  Training",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-conducts-Organ-Donation-Ambassadors-Training-11064.htm",
    "date": "2025-06-02",
    "description": "On May 31, 2025, a group of 16 driven individuals completed the online \"Module 2\" of the Organ Donation Ambassadors program. This 36th group of train...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11064-image1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Govt. College, Gharaunda, Karnal Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Govt-College-Gharaunda-Karnal-Haryana-11058.htm",
    "date": "2025-06-02",
    "description": "On 22 nd  May 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11058-Dr Neena speaking about Organ donation at Govt College.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Govt. College, Karnal Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Govt-College-Karnal-Haryana-11059.htm",
    "date": "2025-06-02",
    "description": "On 25th May 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First Ai...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11059-Dr Neena speaking on the concept of Organ donation.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Greenko, Hydro Project District. Kangra Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Greenko-Hydro-Project-District-Kangra-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-11046.htm",
    "date": "2025-05-30",
    "description": "On 1 st    May 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees & of Greenko, Hydro Project...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11046-Mrs Parveen Mahajan speaking about organ donation.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Greenko, Aastha Project District. Kangra Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Greenko-Aastha-Project-District-Kangra-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-11047.htm",
    "date": "2025-05-30",
    "description": "On 2nd   May 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees & of Greenko, Aastha Project ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11047-Mrs Parveen Mahajan speaking about organ donation.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Govt. Girls College, Bastara, Karnal Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Govt-Girls-College-Bastara-Karnal-Haryana-11048.htm",
    "date": "2025-05-30",
    "description": "17th    May 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecture...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11048-Dr Neena speaking shares the concept of organ donation.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Govt. Girls College, Bastara, Gharaunda, Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Govt-Girls-College-Bastara-Gharaunda-Karnal-Haryana-11020.htm",
    "date": "2025-05-19",
    "description": "On 17th    May 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11020-Dr Neena speaking on the concept of organ donation.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at RLS International School, Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-RLS-International-School-Karnal-Haryana-11019.htm",
    "date": "2025-05-19",
    "description": "On 12th    May 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11019-Dr. Neena speaking about Organ donation.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at M.N.M Public School, Jundla, Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-MNM-Public-School-Jundla-Karnal-Haryana-11018.htm",
    "date": "2025-05-19",
    "description": "On 2 nd     May 2025, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/11018-Dr. Neena speaking about Organ donation.jpg"
  },
  {
    "title": "MOHAN Foundation Conducts Organ Donation Ambassadors training - 35th batch",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-Conducts-Organ-Donation-Ambassadors-training-35th-batch-10939.htm",
    "date": "2025-04-11",
    "description": "On March 08, 2025, a group of nine driven individuals completed Module 2 of the Organ Donation Ambassadors course. A Gratitude Workshop, an expert in...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10939-B35 - Dr Hemal explaining the Modes of Communication.jpg"
  },
  {
    "title": "MOHAN Foundation sets and information desk on Organ Donation in association with Anna University NCC Army Wing",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-sets-and-information-desk-on-Organ-Donation-in-association-with-Anna-University-NCC-Army-Wing-10903.htm",
    "date": "2025-03-31",
    "description": "On March 25, 2025 NCC Army wing of Anna University, organized a blood donation and organ donation camp titled “ Udhra & Angdaan &...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10903-IMG20250325115527.jpg"
  },
  {
    "title": "Organ Donation Ambassadors creates awareness in student community in Delhi- NCR",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassadors-creates-awareness-in-student-community-in-Delhi-NCR-10867.htm",
    "date": "2025-03-20",
    "description": "Organ donation ambassador, Mr Parth Sharma, is dedicated to increase organ donation rates in India and providing patients on transplant waitlist with...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10867-Mr Parth Sharma creates awareness in different places in Delhi.jpeg"
  },
  {
    "title": "Organ Donation Ambassador speaks at Apex Hospital, Jaipur",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-speaks-at-Apex-Hospital-Jaipur-10859.htm",
    "date": "2025-03-18",
    "description": "Apex Hospital in Jaipur held a special celebration of Republic Day on January 26, 2025, and invited Shri P.C. Jain, an organ donation ambassador and ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10859-Organ donation ambassador Celebrates 76th Republic Day in Apex Hospital.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at Vyas Buildcon Pvt. Ltd.",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-Vyas-Buildcon-Pvt-Ltd-10860.htm",
    "date": "2025-03-18",
    "description": "On February 14, 2025, an organ donation awareness talk was organized at Vyas BuildconPvt. Ltd. from 5:00 to 6:00 PM. The session was themed &quot...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10860-Ambassador poster for the session.jpg"
  },
  {
    "title": "Organ Donation Ambassador create awareness through Microsite plugin in",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-create-awareness-through-Microsite-plugin-in-10863.htm",
    "date": "2025-03-18",
    "description": "On 14 Dec, 2024 Dr Rajasi Dharia Organ Donation Ambassador of MOHAN Foundation took an initiative to create an awareness on organ donation through th...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10863-Anant Defence System Pvt Ltd.png"
  },
  {
    "title": "Ambassador overcomes CKD to run marathon in Bengaluru",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-overcomes-CKD-to-run-marathon-in-Bengaluru-10715.htm",
    "date": "2025-01-23",
    "description": "Organ Donation Ambassador Mr. Mr Anant Acharya ran the 2024 Tata Marathon in Bengaluru in March 2024. After his marathon he shared his&nbsp...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10715-Mr. Anant Acharya with participants.jpg"
  },
  {
    "title": "Organ Donation Ambassador speaks at RSS Shakha Parvati & Mitra Mandal, Pune",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-speaks-at-RSS-Shakha-Parvati-Mitra-Mandal-Pune-10716.htm",
    "date": "2025-01-23",
    "description": "On 15 th  January 2025, Mr. Prakash Bapat, Organ Donation Ambassador, MOHAN Foundation, conducted an awareness program at RS...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10716-Mr Prakash Bapat Explaining the concept of organ donation.jpg"
  },
  {
    "title": "Organ donation ambassador helps the Life before Ashes  exhibit promoting organ donation at USICON at Chennai",
    "link": "https://www.mohanfoundation.org/activities/Organ-donation-ambassador-helps-the-Life-before-Ashes-exhibit-promoting-organ-donation-at-USICON-at-Chennai-10692.htm",
    "date": "2025-01-16",
    "description": "The Chennai Trade Centre hosted the 58th Annual Conference of the Urology Society of India (USICON) from January 9–12, 2025. The history, curre...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10692-IMG_20250111_123141.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Dr. Reddys Laboratories Ltd. Baddi, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Dr-Reddys-Laboratories-Ltd-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-10691.htm",
    "date": "2025-01-16",
    "description": "On 8th January 2025, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Dr. Reddy’s Labor...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10691-Participants raised their hands for pledging organ donation.jpg"
  },
  {
    "title": "Awareness Session on Organ Donation at the Lions Club of Juhu, Mumbai, by Ambassador Neal Dastoor",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-on-Organ-Donation-at-the-Lions-Club-of-Juhu-Mumbai-by-Ambassador-Neal-Dastoor-10671.htm",
    "date": "2025-01-06",
    "description": "On 22nd December 2024, Neal Dastoor, in grade 12 at Jamnabai Narsee School, Ambassador, MOHAN Foundation,  conducted an awareness session f...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10671-WhatsApp Image 2025-01-06 at 17.17.14 (1).jpeg"
  },
  {
    "title": "Organ Donation Ambassador speaks to staff of a software company in Chennai",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-speaks-to-staff-of-a-software-company-in-Chennai-10635.htm",
    "date": "2024-12-28",
    "description": "Ideas Infinity Consultancy a HR solution company in Arumbakkam, Chennai accepted the request of Ambassador Vijay to conduct a talk on organ donation....",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10635-IMG20241227164718.jpg"
  },
  {
    "title": "Ambassador organizes a seminar of Organ Donation at Madras School of Social Work.",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-organizes-a-seminar-of-Organ-Donation-at-Madras-School-of-Social-Work-10616.htm",
    "date": "2024-12-23",
    "description": "On Dec 20, 2024 the Students Forum of Madras School of Social Work organized a seminar on Organ Donation  for its members, and invited MOHA...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10616-DSC_0154.JPG"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana Session-9",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-9-10609.htm",
    "date": "2024-12-17",
    "description": "On 15th December 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fir...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10609-participant are very happy to show their donor cards.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana Session-8",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-8-10608.htm",
    "date": "2024-12-17",
    "description": "On 13th December 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fir...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10608-Dr Neena speaking about Organ donation at Red Cross karnal.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Dr. Reddys Laboratories Ltd. Baddi, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Dr-Reddys-Laboratories-Ltd-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-10596.htm",
    "date": "2024-12-12",
    "description": "On 6th December 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Dr. Reddy’s Labo...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10596-Mrs Parveen Mahajan Explains the concept of  organ donation.jpg"
  },
  {
    "title": "MOHAN Foundation Conducts Organ Donation Ambassadors training - 33rd batch.",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-Conducts-Organ-Donation-Ambassadors-training-33rd-batch-10591.htm",
    "date": "2024-12-10",
    "description": "On December 07, 2024, a group of nine driven individuals completed Module 2 of the Organ Donation Ambassadors course. A Gratitude Workshop, an expert...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10591-B 33 Interactions with experts (2).jpeg"
  },
  {
    "title": "MFJCF Ambassadors Shine at National Transplant Games 2024",
    "link": "https://www.mohanfoundation.org/activities/MFJCF-Ambassadors-Shine-at-National-Transplant-Games-2024-10592.htm",
    "date": "2024-12-01",
    "description": "MFJCF Ambassadors made a significant impact at the recently concluded National Transplant Games 2024, held in Mumbai from 1st to 3rd December. The te...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10592-mfjcf10dec2024-1.jpg"
  },
  {
    "title": "MOHAN Foundation ambassadors Promote Organ Donation Awareness in Zakir Nagar, New Delhi",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-ambassadors-Promote-Organ-Donation-Awareness-in-Zakir-Nagar-New-Delhi-10539.htm",
    "date": "2024-11-21",
    "description": "On November 15, 2024, MOHAN Foundation interns Mr. Sameer Khan and Ms. Eram Firdous, both pursuing a one-year diploma in Public Health from Jamia Mil...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10539-iznndt1.jpg"
  },
  {
    "title": "Ambassador creates awareness through a rally and information desk",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-creates-awareness-through-a-rally-and-information-desk-10524.htm",
    "date": "2024-11-15",
    "description": "Lions  Club Pune 21st century organized the event namely \" 21st Lions World Diabetes awareness & Organ Donation Programmed 2024\" at NMV Scho...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10524-Mr Prakash baapt with the office bearers of the Lions Club.jpg"
  },
  {
    "title": "Ambassador conducted an webinar on Organ Donation for the  community people",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducted-an-webinar-on-Organ-Donation-for-the-community-people-10520.htm",
    "date": "2024-11-14",
    "description": "On 16 th April 2024, Mr. Subash Chandra Sarangi, Ambassador,MOHAN Foundation, conducted an awareness program on zoommeet for the community people. Mr...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10520-Activities of the Subash Sarangi.png"
  },
  {
    "title": "Organ Donation Ambassador speaks at the Thakur Naturopathy Foundation, Bihar",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-speaks-at-the-Thakur-Naturopathy-Foundation-Bihar-10518.htm",
    "date": "2024-11-14",
    "description": "Organ Donation Ambassador Mr. Subash Chandra Sarangi,  is a multifaceted person. He was invited as a resource person by Thak...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10518-Activities of the Subash Sarangi.png"
  },
  {
    "title": "Organ Donation Ambassador speaks at the Yashwantrao Chavan Academy of Development Administration, Pune",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-speaks-at-the-Yashwantrao-Chavan-Academy-of-Development-Administration-Pune-10519.htm",
    "date": "2024-11-14",
    "description": "On 23 rd  February 2024, Mr. Subash Chandra Sarangi, Organ Donation Ambassador, MOHAN Foundation, conducted an awareness program ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10519-Activities of the Subash Sarangi.png"
  },
  {
    "title": "Ambassador Dr. Neena Conducted an Awareness Talk at District Level Youth Red Cross Training Camp, Karnal Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-Conducted-an-Awareness-Talk-at-District-Level-Youth-Red-Cross-Training-Camp-Karnal-Haryana-10506.htm",
    "date": "2024-11-11",
    "description": "On 5th November 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10506-Dr Neena speaking about Organ donation at District level youth red cross.jpg"
  },
  {
    "title": "Ambassador uses Facebook to create awareness on organ donation in October 2024",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-uses-Facebook-to-create-awareness-on-organ-donation-in-October-2024-10495.htm",
    "date": "2024-11-06",
    "description": "In October 2024 Organ Donation Ambassador Sapna N Sapna created 71 posts (29– Organ Donation; 34 – Eye donation; 08 - Blood donation) on ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10495-Untitled.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at VMT Spinning company Limited Baddi, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-VMT-Spinning-company-Limited-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-10459.htm",
    "date": "2024-10-25",
    "description": "On 16th October 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of VMT Spinning Company L...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10459-Mrs Parveen Mahajan speaking about organ donation at VMT.jpg"
  },
  {
    "title": "Organ Donation Ambassador recognised for her efforts to raise awareness on eye donation",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-recognised-for-her-efforts-to-raise-awareness-on-eye-donation-10466.htm",
    "date": "2024-10-25",
    "description": "Around 2023, Dr Rajkumari Jain of  Parola, Maharashtra started engaging communities to support eye donation.  In the past decade she has sp...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10466-Dr Rajkumari Jain of  Parola  Maharashtra received State and National awards from IMA  Lions Clubs.jpg"
  },
  {
    "title": "MOHAN Foundation conducts Ambassador Training for volunteers",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-conducts-Ambassador-Training-for-volunteers-10432.htm",
    "date": "2024-10-10",
    "description": "A group of 10 young enthusiasts joined module 2 of the Organ Donation Ambassador training on October 05, 2024.  This Batch 33 training was ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10432-Dr hemal welcoming the trainees.jpg"
  },
  {
    "title": "Ambassador conducts awareness program at Pulianthope, Chennai",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-awareness-program-at-Pulianthope-Chennai-10437.htm",
    "date": "2024-10-10",
    "description": "On October 8 th  2024, a community program was organized by ambassador K. Bharath sri (intern from MSSW), at Don Bosco Social Service Society (D...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10437-IMG_2682.jpeg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Vardhman Group Baddi, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Vardhman-Group-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-10411.htm",
    "date": "2024-10-01",
    "description": "On 27th September 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Vardhman Group Baddi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10411-Mrs Parveen Mahajan speaking about the concept of organ donation.jpg"
  },
  {
    "title": "Organ Donation Ambassador organises a Community Program at Kolathur, Chennai",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-organises-a-Community-Program-at-Kolathur-Chennai-10408.htm",
    "date": "2024-09-30",
    "description": "On 28 th  September 2024, a community program was organised by ambassador Stephen Joy.  Working women and housewives from the area of Dr. A...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10408-A Happy Group photo with participants.jpg"
  },
  {
    "title": "Ambassador uses Facebook to create awareness on organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-uses-Facebook-to-create-awareness-on-organ-donation-10409.htm",
    "date": "2024-09-30",
    "description": "In September 2024 Organ Donation Ambassador Sapna N Sapna created 95 posts (43– Organ Donation; 43 – Eye donation; 09 - Blood d...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10409-Sapna N Sapna.jpg"
  },
  {
    "title": "Organ Donation Ambassador organises a Community Program at Kolathur, Chennai",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-organises-a-Community-Program-at-Kolathur-Chennai-10408.htm",
    "date": "2024-09-30",
    "description": "On 28 th  September 2024, a community program was organised by ambassador Stephen Joy.  Working women and housewives from the area of Dr. A...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10408-Mr. Stephen Explains the Concept of organ donation (1).jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana Session-7",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-7-10382.htm",
    "date": "2024-09-24",
    "description": "On 19th September 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10382-Dr. Neena speaking about Organ donation at Red Cross karnal on 19th september 2024.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Edelmann Group, Baddi Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Edelmann-Group-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-10381.htm",
    "date": "2024-09-24",
    "description": "On 11th September 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Edelmann Group, Badd...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10381-Mrs Parveen Mahajan speaks on the concept of organ donation.jpg"
  },
  {
    "title": "Ambassadors of K J Somaiya College of Nursing create awareness on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-of-K-J-Somaiya-College-of-Nursing-create-awareness-on-Organ-Donation-10375.htm",
    "date": "2024-09-20",
    "description": "Every year volunteers of the National Service Scheme (NSS) conduct camps in rural areas. Organ donation Ambassadors from K J Somaiya College of Nursi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10375-IMG-20230211-WA0012(1).jpg"
  },
  {
    "title": "Ambassador uses Facebook to create awareness on organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-uses-Facebook-to-create-awareness-on-organ-donation-10331.htm",
    "date": "2024-09-06",
    "description": "In August 2024 Organ Donation Ambassador Sapna N Sapna created 59 posts (23– Organ Donation; 23 – Eye donation; 13 - Blood dona...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10331-Screenshot (164).png"
  },
  {
    "title": "Awareness Talk on Organ Donation at Suvidha NGO Kiri Chamba, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Suvidha-NGO-Kiri-Chamba-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-10261.htm",
    "date": "2024-08-24",
    "description": "On 12th August 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Suvidha NGO Kiri Chamba...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10261-Mrs Parveen Mahajan speaking about organ donation.jpg"
  },
  {
    "title": "Batch 30 of Organ Donation Ambassadors complete their training",
    "link": "https://www.mohanfoundation.org/activities/Batch-30-of-Organ-Donation-Ambassadors-complete-their-training-10252.htm",
    "date": "2024-08-22",
    "description": "A group of 8 motivated individuals underwent  the Module 2 of the Organ Donation Ambassadors training on August 17, 2024. As part of the tr...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10252-Screen Shot 2024-08-17 at 3.50.57 PM.png"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana Session-6",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-6-10242.htm",
    "date": "2024-08-21",
    "description": "On 18th August 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10242-participants supporting organ donation.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana Session-5",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-5-10241.htm",
    "date": "2024-08-21",
    "description": "On 16th August 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10241-Dr Neena speaking about Organ donation at Red Cross karnal.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Vardhman Group Baddi, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Vardhman-Group-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-10239.htm",
    "date": "2024-08-21",
    "description": "On 14th August 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Varhman Group Baddi, Hi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10239-Mrs Parveen Mahajan speaking about organ donation.jpg"
  },
  {
    "title": "Awareness Session at Jail Training School Karnal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Jail-Training-School-Karnal-Haryana-by-Ambassador-Dr-Neena-10240.htm",
    "date": "2024-08-21",
    "description": "On 11 th  August 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fir...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10240-Dr Neena speaking on concept of  Organ donation.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Shakuntala Devi Foundation, Beauty Culture Toga Village, Punjab by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Shakuntala-Devi-Foundation-Beauty-Culture-Toga-Village-Punjab-by-Ambassador-Mrs-Parveen-Mahajan-10215.htm",
    "date": "2024-08-17",
    "description": "On the occasion of Indian Organ Donation Day, On (3rd August 2024) Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, organized awareness session on...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10215-Group picture of the day.JPG"
  },
  {
    "title": "Awareness Talk on Organ Donation at Shakuntala Devi Foundation, Beauty Culture Toga Village, Punjab by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Shakuntala-Devi-Foundation-Beauty-Culture-Toga-Village-Punjab-by-Ambassador-Mrs-Parveen-Mahajan-10215.htm",
    "date": "2024-08-17",
    "description": "On the occasion of Indian Organ Donation Day, On (3rd August 2024) Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, organized awareness session on...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10215-Group picture of the day.JPG"
  },
  {
    "title": "Ambassador uses Facebook to create awareness on organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-uses-Facebook-to-create-awareness-on-organ-donation-10169.htm",
    "date": "2024-08-06",
    "description": "In July 2024 Organ Donation Ambassador Sapna N Sapna created 88 posts (62– Organ Donation; 21 – Eye donation; 5 - Blood donatio...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10169-SwapnaNSapna.jpg"
  },
  {
    "title": "Awareness Session at Aastha College of Eduation, Bhagwanpur, Yamuna Nagar Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Aastha-College-of-Eduation-Bhagwanpur-Yamuna-Nagar-Haryana-by-Ambassador-Dr-Neena-10137.htm",
    "date": "2024-08-02",
    "description": "On 26 th  July 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10137-1.jpg"
  },
  {
    "title": "AWARENESS PROGRAM AT ARIYUR GOVT HIGH SCHOOL, VELLORE",
    "link": "https://www.mohanfoundation.org/activities/AWARENESS-PROGRAM-AT-ARIYUR-GOVT-HIGH-SCHOOL-VELLORE-10132.htm",
    "date": "2024-08-01",
    "description": "On July 26, 2024, the MOHAN Foundation held an awareness program on organ donation at Ariyur Government High School, Vellore for students of class 9t...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10132-1.jpg"
  },
  {
    "title": "AWARENESS PROGRAM AT PENNATHUR GOVT HIGH SCHOOL, VELLORE",
    "link": "https://www.mohanfoundation.org/activities/AWARENESS-PROGRAM-AT-PENNATHUR-GOVT-HIGH-SCHOOL-VELLORE-10106.htm",
    "date": "2024-07-22",
    "description": "On July 19, 2024, the MOHAN Foundation organized an awareness program at Pennathur Government High School, Vellore for students of class 11. The prog...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10106-1.JPG"
  },
  {
    "title": "Ambassador in Kolkata conducts a series of talks on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-in-Kolkata-conducts-a-series-of-talks-on-Organ-Donation-10099.htm",
    "date": "2024-07-20",
    "description": "Mrs Mamta Gupta a trained Organ Donation Ambassador in Kolkata has taken up the cause with great fervor.  She conducted a series of talks a...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10099-IMG-20240713-.jpg"
  },
  {
    "title": "Awareness Session at Satluj Jal Vidyut Nigam, Nathpa Jhakri, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Satluj-Jal-Vidyut-Nigam-Nathpa-Jhakri-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-10080.htm",
    "date": "2024-07-16",
    "description": "On 7 th  July 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation organised awareness talk on organ donation for the employees of Satluj Ja...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10080-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Vardhman Group, Baddi Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Vardhman-Group-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-10079.htm",
    "date": "2024-07-16",
    "description": "On 1 st  July 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Vardhman Group, Baddi, H...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10079-2.jpg"
  },
  {
    "title": "Organ Donation Awareness at AGM - Street Cause",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-at-AGM-Street-Cause-10035.htm",
    "date": "2024-06-27",
    "description": "Street Cause, a student-governed NGO with the vision of uplifting and serving humankind, organized its Annual General Meeting on June 23, 2024, at Ta...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/10035-qwe.JPG"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana Session-4",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-4-9994.htm",
    "date": "2024-06-12",
    "description": "Session -4    On 11th June 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9994-1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana Session-3",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-3-9993.htm",
    "date": "2024-06-11",
    "description": "Session -3    On 7th June 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay L...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9993-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Havells India Ltd. Baddi Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Havells-India-Ltd-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9987.htm",
    "date": "2024-06-07",
    "description": "On 1st June 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Havells India Pvt. Ltd. Ba...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9987-All participants pledge for Organ donation.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Greenko Budhel District Chamba Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Greenko-Budhel-District-Chamba-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9988.htm",
    "date": "2024-06-07",
    "description": "On 3rd June 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Greenko, Budhel District C...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9988-Ambassador Mrs.Parveen speaking about organ donation.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Greenko, Tarala District Chamba Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Greenko-Tarala-District-Chamba-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9989.htm",
    "date": "2024-06-07",
    "description": "On 4th June 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Greenko, Tarala District C...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9989-participants during the session.jpg"
  },
  {
    "title": "Ambassador successfully coordinates voluntary body donation in Dahod, Gujarat",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-successfully-coordinates-voluntary-body-donation-in-Dahod-Gujarat-9969.htm",
    "date": "2024-06-03",
    "description": "A request for a body donation from Dahod, Gujarat, was received by Ambassador Mr. Kalpeshsinh Rathod in Vadodara on May 23, 2024. Following the death...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9969-IMG-20240524-WA0007.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Vardman, Baddi Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Vardman-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9952.htm",
    "date": "2024-05-23",
    "description": "On 18 th  May 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Vardman, Baddi Himachal ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9952-1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana Session -2",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-2-9950.htm",
    "date": "2024-05-23",
    "description": "On 20th May 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First Ai...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9950-1.JPG"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana  Session -1",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-Session-1-9949.htm",
    "date": "2024-05-23",
    "description": "On 4th May 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9949-1.JPG"
  },
  {
    "title": "Awareness Talk on Organ Donation at Jaipur Metro by MFJCF Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Jaipur-Metro-by-MFJCF-Ambassadors-9946.htm",
    "date": "2024-05-10",
    "description": "On 10 th  May, 2024 Awareness Talk on Organ Donation at Jaipur Metro by MFJCF Ambassadors. Organ donation took the baton for MFJCF to promote the nob...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9946-jmbmst1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at KAG Industries, Kala Amb Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-KAG-Industries-Kala-Amb-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9927.htm",
    "date": "2024-05-08",
    "description": "On 1 st  May 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of KAG Industries, Kala Amb, Hima...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9927-Mrs Parveen Mahajan speaking about Organ Donation on 1st May 2024 at KAG Industries  Himachal Pradesh.jpg"
  },
  {
    "title": "Ambassadors Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-Organ-Donation-9937.htm",
    "date": "2024-05-07",
    "description": "MFJCF has launched a new Venture - making of “Ambassadors-Organ Donation”. We enrolled 2 persons to spread the awareness of the cause in ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9937-maodtj1.jpg"
  },
  {
    "title": "Organ Donation Ambassador runs a 5K marathon to create awareness on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-runs-a-5K-marathon-to-create-awareness-on-Organ-Donation-9903.htm",
    "date": "2024-05-04",
    "description": "Hey all, I am Anant Acharya from Bengaluru. On April 28, 2024 I participated in the 5km Majja run category, which is conducted by World TCS 10k Run B...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9903-Ms. Ranjini distibuting ambassador brochure.jpg"
  },
  {
    "title": "Awareness Session organised by Organ Donation Ambassador at Shakuntala Devi Foundation, Stitching Centre Saketri Haryana",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-organised-by-Organ-Donation-Ambassador-at-Shakuntala-Devi-Foundation-Stitching-Centre-Saketri-Haryana-9885.htm",
    "date": "2024-04-27",
    "description": "On 20th April 2024, MOHAN Foundation was invited by Organ Donation Ambassador Mrs. Parveen Mahajan to conduct an awareness talk on organ donatio...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9885-atsdfsct1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Jeevan Chanan College of Education, Assandh, Karnal Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Jeevan-Chanan-College-of-Education-Assandh-Karnal-Haryana-9879.htm",
    "date": "2024-04-25",
    "description": "On 10 th  April 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9879-Dr. Neena Ambassador speaking about organ donation Jeevan Chanan College of Education Assandh Karnal Haryana.jpg"
  },
  {
    "title": "Young minds motivated by a talk on organ donation at Tiruvannamalai",
    "link": "https://www.mohanfoundation.org/activities/Young-minds-motivated-by-a-talk-on-organ-donation-at-Tiruvannamalai-9824.htm",
    "date": "2024-04-03",
    "description": "Organ Donation Ambassador Ms.Sangeetha approached the  Bhagavan Higher Secondary School, Thiruvannamalai for an&nb...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9824-IMG_6676.jpeg"
  },
  {
    "title": "Organ donation awareness talk at the old Municipality Office at Tiruvannamalai",
    "link": "https://www.mohanfoundation.org/activities/Organ-donation-awareness-talk-at-the-old-Municipality-Office-at-Tiruvannamalai-9822.htm",
    "date": "2024-04-03",
    "description": "MOHAN Foundation was given an opportunity to create awareness on organ donation for the dengue breeding control staff at the old municipality office ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9822-1.jpeg"
  },
  {
    "title": "Municipal cleaning and sweeping staff learn about organ donation at Thiruvannamalai.",
    "link": "https://www.mohanfoundation.org/activities/Municipal-cleaning-and-sweeping-staff-learn-about-organ-donation-at-Thiruvannamalai-9821.htm",
    "date": "2024-04-03",
    "description": "On 26 th  March Organ Donation Ambassador Ms. Sangeetha K. (Intern,SRIHER) conducted an awareness talk on organ donation to ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9821-1.jpeg"
  },
  {
    "title": "Awareness Talk on Organ Donation at UltraTech Cement, Baga Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-UltraTech-Cement-Baga-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9808.htm",
    "date": "2024-03-30",
    "description": "On 18th March 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Ultratech Cement, Baga, Himac...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9808-Mrs Parveen Mahajan speaking about Organ Donation on 18th March 2024 at UTRATECH BAGA Himachal Pradesh.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Baba Fateh Singh Ji College Assandh Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Baba-Fateh-Singh-Ji-College-Assandh-Karnal-Haryana-9801.htm",
    "date": "2024-03-28",
    "description": "On 18th March 2024, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9801-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Greenko Pvt. Ltd. Jhakri, District Shimla Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Greenko-Pvt-Ltd-Jhakri-District-Shimla-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9773.htm",
    "date": "2024-03-12",
    "description": "On 3rd March 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Greenko Pvt Ltd. Jhakri Distri...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9773-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Greenko, Sorang District Kinnaur Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Greenko-Sorang-District-Kinnaur-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9772.htm",
    "date": "2024-03-08",
    "description": "On 1 st  March 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Greenko, Sorang District Kin...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9772-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Govt. P.G. College Una Himachal Pradesh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Govt-PG-College-Una-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-9738.htm",
    "date": "2024-02-29",
    "description": "On 25 th  October 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session   for the students & Staff of Go...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9738-1.jpg"
  },
  {
    "title": "Batch 27 of Organ Donation Ambassadors complete their training",
    "link": "https://www.mohanfoundation.org/activities/Batch-27-of-Organ-Donation-Ambassadors-complete-their-training-9712.htm",
    "date": "2024-02-19",
    "description": "A group of four motivated individuals underwent  the Module 2 of the Organ Donation Ambassadors training on February 10, 2024. This 27th ba...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9712-1.jpeg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Parvati II NHPC, District Mandi Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Parvati-II-NHPC-District-Mandi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9709.htm",
    "date": "2024-02-18",
    "description": "On 7th   February 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Parvati II NHPC, District...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9709-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at, KB DAV Senior Secondary School Sector-7 Chandigarh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-KB-DAV-Senior-Secondary-School-Sector-7-Chandigarh-by-Ambassador-Mrs-Parveen-Mahajan-9664.htm",
    "date": "2024-02-02",
    "description": "On 10th January 2023, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session on organ donation for the students of KB DAV Sen...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9664-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at AJ Infrastructure Ltd. Kala Amb Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-AJ-Infrastructure-Ltd-Kala-Amb-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9666.htm",
    "date": "2024-02-02",
    "description": "On 18 th  January 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of AJ Infrastucture Ltd. Kal...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9666-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Campus Actiwear Baddi, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Campus-Actiwear-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9665.htm",
    "date": "2024-02-02",
    "description": "On 6th   January 2024, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees of Campus Actiwear Baddi, Him...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9665-1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Kaleen Lifestyle Private Limited Kohand, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Kaleen-Lifestyle-Private-Limited-Kohand-Haryana-9599.htm",
    "date": "2024-01-02",
    "description": "On 21 st  December 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer F...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9599-2.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Biological E Ltd. Poanta Sahib, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Biological-E-Ltd-Poanta-Sahib-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9580.htm",
    "date": "2023-12-27",
    "description": "On 23 rd  December 2023, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees & of Biological E Ltd. ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9580-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Greenko, Awa Aastha Project District. Kangra Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Greenko-Awa-Aastha-Project-District-Kangra-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9570.htm",
    "date": "2023-12-26",
    "description": "On 16 th  December 2023, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees & of Greenko, Awa Aasth...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9570-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Greenko, Palampur Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Greenko-Palampur-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9565.htm",
    "date": "2023-12-20",
    "description": "On 13 th  December 2023, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees & of Greenko, Palampur ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9565-1.jpg"
  },
  {
    "title": "Organ Donation Ambassador conducts an awareness session in Pune",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-conducts-an-awareness-session-in-Pune-9563.htm",
    "date": "2023-12-19",
    "description": "Mr Prakash Bapat, Organ Donation Ambassador  from Pune  conducted the seminar on 'Organ Donation: A Supreme Gift' for 'Ekata Mahila Ma...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9563-1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at KDDL, Parwanoo Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-KDDL-Parwanoo-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-9558.htm",
    "date": "2023-12-17",
    "description": "On 6 th  December 2023, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session for the Employees & of KDDL, Parwanoo.   ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9558-1.jpg"
  },
  {
    "title": "Batch 26 of Organ Donation Ambassadors complete their training",
    "link": "https://www.mohanfoundation.org/activities/Batch-26-of-Organ-Donation-Ambassadors-complete-their-training-9517.htm",
    "date": "2023-11-28",
    "description": "Twenty sixth batch Organ Donation Ambassador module 2 training was conducted online on November 25, 2023. From school student to office professionals...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9517-1.png"
  },
  {
    "title": "Awareness Talk on Organ Donation at Shakuntala Devi Foundation, Stitching Centre Saketri Haryana by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Shakuntala-Devi-Foundation-Stitching-Centre-Saketri-Haryana-by-Ambassador-Mrs-Parveen-Mahajan-9513.htm",
    "date": "2023-11-27",
    "description": "On 24th November 2023, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session on organ donation for the students of SDF, Stit...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9513-1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Globe Toyota karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Globe-Toyota-karnal-Haryana-9506.htm",
    "date": "2023-11-21",
    "description": "On 18 th  November 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9506-1.jpg"
  },
  {
    "title": "Organ Donation Ambassador uses social media to speak on organ donation",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-uses-social-media-to-speak-on-organ-donation-9447.htm",
    "date": "2023-10-30",
    "description": "In September 2023 Organ Donation Ambassador Sapna N Sapna created 83 posts (47– Organ Donation; 31 – Eye donation; 5 - Blood do...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9447-1.png"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at State level workshop on Organ Donation organised by Red Cross Karnal Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-State-level-workshop-on-Organ-Donation-organised-by-Red-Cross-Karnal-Haryana-9446.htm",
    "date": "2023-10-28",
    "description": "On 25 th  October 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9446-1.JPG"
  },
  {
    "title": "Awareness Talk on Organ Donation at Mount Carmel School Sector-47 Chandigarh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Mount-Carmel-School-Sector-47-Chandigarh-by-Ambassador-Mrs-Praveen-Mahajan-9416.htm",
    "date": "2023-10-17",
    "description": "On 9 th  October 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session on organ donation for NSS Volunteers at Mount C...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9416-11.jpg"
  },
  {
    "title": "MOHAN Foundation's Organ Donation Ambassador conducts an awareness at Senior Citizens Club",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundations-Organ-Donation-Ambassador-conducts-an-awareness-at-Senior-Citizens-Club-9415.htm",
    "date": "2023-10-16",
    "description": "Mr Prakash Bapat of Pune was invited to speak on \"Organ Donation: Save a Life after Life'' at Jivahala Senior Citizen Club, Shephalika Society K...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9415-prbaambtk1.jpg"
  },
  {
    "title": "Awareness Talk on Organ Donation at Sri Guru Gobind Singh College of Pharmacy Sector-26 Chandigarh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Sri-Guru-Gobind-Singh-College-of-Pharmacy-Sector-26-Chandigarh-by-Ambassador-Mrs-Parveen-Mahajan-9406.htm",
    "date": "2023-10-14",
    "description": "On 12 th  September 2023, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session  on organ donation for NSS Volunteers a...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9406-1.JPG"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Gian Bharti college of  Education,  Matak Majri  karnal, Haryana, Session-1",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Gian-Bharti-college-of-Education-Matak-Majri-karnal-Haryana-Session-1-9407.htm",
    "date": "2023-10-14",
    "description": "On 22 nd  August 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fir...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9407-2.JPG"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at PM Shri. Sanskriti Govt. Senior Secondary School Kutail, karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-PM-Shri-Sanskriti-Govt-Senior-Secondary-School-Kutail-karnal-Haryana-9408.htm",
    "date": "2023-10-14",
    "description": "On 13th September 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9408-22.JPG"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Raghubir College of Education Jundla karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Raghubir-College-of-Education-Jundla-karnal-Haryana-9409.htm",
    "date": "2023-10-14",
    "description": "On 12 th  Setember 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer F...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9409-1.JPG"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Govt. Senior Secondary School Daha, karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Govt-Senior-Secondary-School-Daha-karnal-Haryana-9410.htm",
    "date": "2023-10-14",
    "description": "On 14th August 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9410-1.JPG"
  },
  {
    "title": "Awareness Talk on Organ Donation at Shakuntala Devi Foundation, Beauty Culture Toga Village, Punjab by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Organ-Donation-at-Shakuntala-Devi-Foundation-Beauty-Culture-Toga-Village-Punjab-by-Ambassador-Mrs-Parveen-Mahajan-9411.htm",
    "date": "2023-10-14",
    "description": "On 3rd October 2023, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation, conducts awareness session on organ donation for the students of SDF, Beauty...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9411-1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for Driving Licence Students at Red Cross, Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-Driving-Licence-Students-at-Red-Cross-Karnal-Haryana-9403.htm",
    "date": "2023-10-13",
    "description": "On 4th September 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fir...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9403-1.JPG"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Minerva College of Education, Taraori, Distt. Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Minerva-College-of-Education-Taraori-Distt-Karnal-Haryana-9404.htm",
    "date": "2023-10-13",
    "description": "On 8th September 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fir...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9404-1.JPG"
  },
  {
    "title": "Awareness Session for Staff and First Aid Training students, Red Cross Punjab, Chandigarh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-Staff-and-First-Aid-Training-students-Red-Cross-Punjab-Chandigarh-by-Ambassador-Mrs-Parveen-Mahajan-9405.htm",
    "date": "2023-10-13",
    "description": "On 1st September 2023, MOHAN Foundation was invited by the Secretary, Red Cross, Punjab on the occasion of Organ Donation Day, to conduct session for...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9405-11.JPG"
  },
  {
    "title": "Batch 25 of Organ Donation Ambassadors complete their training",
    "link": "https://www.mohanfoundation.org/activities/Batch-25-of-Organ-Donation-Ambassadors-complete-their-training-9344.htm",
    "date": "2023-10-03",
    "description": "A small group of people joined the 25th batch of Organ Donation Ambassadors module 2 training on 30th Sept 2023. Ranging from school students to seni...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9344-2.jpeg"
  },
  {
    "title": "Organ Donation Ambassador conducts awareness at Davangere, Karnataka",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-conducts-awareness-at-Davangere-Karnataka-9345.htm",
    "date": "2023-10-03",
    "description": "Organ Donation Ambassador Dr Shilpashri A M, Prof ,Dept of Anaesthesiology, Govt Medical College conducted a session for  the first year st...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9345-IMG-20231003-WA0010.jpg"
  },
  {
    "title": "Awareness Session for staff of Club Mahindra, Kandaghat",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-staff-of-Club-Mahindra-Kandaghat-9237.htm",
    "date": "2023-08-30",
    "description": "On 12th August 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, organised session for staff of Club Mahindra, Kandaghat.   Around ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9237-7cf150fc-aeff-4169-a8b2-17fd4f96723d.JPG"
  },
  {
    "title": "Awareness Session for staff of Alaina Healthcare Ltd",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-staff-of-Alaina-Healthcare-Ltd-9238.htm",
    "date": "2023-08-30",
    "description": "On 12th August 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, organised session for staff of Alaina Healthcare Ltd, Baddi. Around 25 Parti...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9238-ceed5550-5b5d-4e3a-8254-df4d8b915a97.JPG"
  },
  {
    "title": "Awareness Session for staff of Mahindra Club & Resort",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-staff-of-Mahindra-Club-Resort-9239.htm",
    "date": "2023-08-30",
    "description": "On 12th August 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, organised session for staff of Mahindra Club & Resort, Naldhera, Shimla....",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9239-7dd2c6b6-73d5-4b2b-9560-358b0b3ea8a1.JPG"
  },
  {
    "title": "Awareness Session at Gian Bharti College of Education",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Gian-Bharti-College-of-Education-9221.htm",
    "date": "2023-08-25",
    "description": "On 1st August 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9221-0ff859f8-67ba-4988-9b42-1a37c99bd0f6.JPG"
  },
  {
    "title": "Ambassador speaks at IIIT, Nagpur on the occasion of 13th National Organ Donation Day, 2023",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-speaks-at-IIIT-Nagpur-on-the-occasion-of-13th-National-Organ-Donation-Day-2023-9219.htm",
    "date": "2023-08-24",
    "description": "With the aim to create awareness about organ donation, dispel myths and misconceptions associated with organ donation and motivate and encourage...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9219-asinnoddtk1.jpg"
  },
  {
    "title": "Awareness Session at MDN College of Education, Kalyat, Distt. Kaithal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-MDN-College-of-Education-Kalyat-Distt-Kaithal-Haryana-by-Ambassador-Dr-Neena-9193.htm",
    "date": "2023-08-19",
    "description": "On 1 st  August 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9193-mdncoedkdktk1.jpg"
  },
  {
    "title": "Awareness Session at MDN College of Nursing, Kalyat, Distt. Kaithal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-MDN-College-of-Nursing-Kalyat-Distt-Kaithal-Haryana-by-Ambassador-Dr-Neena-9175.htm",
    "date": "2023-08-09",
    "description": "On 2 nd  August 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9175-mdncnutknna1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at MDN Public School, Kalyat, Distt. Kaithal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-MDN-Public-School-Kalyat-Distt-Kaithal-Haryana-9176.htm",
    "date": "2023-08-09",
    "description": "On 3rd August 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9176-mpskdkhtk1.jpg"
  },
  {
    "title": "Awareness Session for First Aid Training Students, U.T, Chandigarh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-First-Aid-Training-Students-UT-Chandigarh-by-Ambassador-Mrs-Praveen-Mahajan-9155.htm",
    "date": "2023-08-05",
    "description": "On 27 th  July 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, organised session for First Aid Students of Red Cross, Chandigarh.  Aro...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9155-fastastk1.jpg"
  },
  {
    "title": "Ambassador uses Facebook to create awareness on organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-uses-Facebook-to-create-awareness-on-organ-donation-9122.htm",
    "date": "2023-07-29",
    "description": "In July 2023 Organ Donation Ambassador Sapna N Sapna created 87 posts (68– Organ Donation; 11 – Eye donation; 8 - Blood donatio...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9122-1.jpg"
  },
  {
    "title": "Organ Donation Ambassador organizes a talk at Gopalpur Beach, Odisha",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-organizes-a-talk-at-Gopalpur-Beach-Odisha-9119.htm",
    "date": "2023-07-28",
    "description": "July has been declared as Organ Donation Month with the launch ‘Angdaan Mahotsav’ by the Central Government of India.  On ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9119-1.jpg"
  },
  {
    "title": "Awareness Session at Red Cross, Karnal, Haryana conducted by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Red-Cross-Karnal-Haryana-conducted-by-Ambassador-Dr-Neena-9120.htm",
    "date": "2023-07-28",
    "description": "On 4 th  July 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9120-rckanlhtk1.jpg"
  },
  {
    "title": "Organ Donation Ambassador conducts an online awareness session",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-conducts-an-online-awareness-session-9115.htm",
    "date": "2023-07-27",
    "description": "Dr Subash Kumar Sarangi of Odisha is a mentor, yoga and naturopath expert. Nearly 10 year ago he read about organ donation and  trained as ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9115-WhatsApp Image 2023-07-27 at 12.01.14.jpeg"
  },
  {
    "title": "Symbiosis Institute of Technology,  Nagpur invites Organ Donation Ambassador for a session",
    "link": "https://www.mohanfoundation.org/activities/Symbiosis-Institute-of-Technology-Nagpur-invites-Organ-Donation-Ambassador-for-a-session-9110.htm",
    "date": "2023-07-25",
    "description": "July has been declared as Organ Donation Month with the launch of ‘Angdaan Mahotsav’ by the Central Government of India. Rising to t...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9110-IMG-20230722-WA0035.jpg"
  },
  {
    "title": "Ambassador uses Facebook to create awareness on organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-uses-Facebook-to-create-awareness-on-organ-donation-9090.htm",
    "date": "2023-07-04",
    "description": "In June 2023 Ambassador Sapna N Sapna created 81 posts (45– Organ Donation; 15 – Eye donation; 21- Blood donation) on her Faceb...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9090-s2.jpg"
  },
  {
    "title": "Organ donation awareness at Pandharpur Vari",
    "link": "https://www.mohanfoundation.org/activities/Organ-donation-awareness-at-Pandharpur-Vari-9060.htm",
    "date": "2023-07-01",
    "description": "Organ Donation Ambassador, Dr Asha Shitole of Kolhapur Maharashtra has been promoting organ donation for the past two years through her social n...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9060-P1.jpg"
  },
  {
    "title": "Awareness Session at Blue Star Limited, Kala Amb, Himachal Pradesh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Blue-Star-Limited-Kala-Amb-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-9056.htm",
    "date": "2023-06-28",
    "description": "On 23 rd  June 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and Resource person of HP Red Cross organized awareness talk on Organ Donatio...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9056-bslkahptkk1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Red Cross, Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Red-Cross-Karnal-Haryana-9053.htm",
    "date": "2023-06-27",
    "description": "On 22 nd  June 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9053-adnrckhtkk1.jpg"
  },
  {
    "title": "Awareness Session on Organ Donation conducted at Red Cross, Karnal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-on-Organ-Donation-conducted-at-Red-Cross-Karnal-Haryana-by-Ambassador-Dr-Neena-9048.htm",
    "date": "2023-06-22",
    "description": "On 16 th  June 2023, Dr. Neena, Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Firs...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9048-rckhbamdrnatk1.jpg"
  },
  {
    "title": "Awareness Session on Organ Donation at Red Cross, Karnal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-on-Organ-Donation-at-Red-Cross-Karnal-Haryana-by-Ambassador-Dr-Neena-9040.htm",
    "date": "2023-06-13",
    "description": "On 9 th  June 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9040-rckhramdnatk1.jpg"
  },
  {
    "title": "Installation of Organ Donation Information Standee",
    "link": "https://www.mohanfoundation.org/activities/Installation-of-Organ-Donation-Information-Standee-9037.htm",
    "date": "2023-06-12",
    "description": "Ambassador Kalpeshsinh Rathod designed and installed organ donation standees in his workspace at the Bhailal AminGeneral Hospital...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9037-9037-1.jpg"
  },
  {
    "title": "Organ Donation Awareness Talk at St. Bridgets Institute of Home Nursing, Aldona, Bardez, Goa",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Talk-at-St-Bridgets-Institute-of-Home-Nursing-Aldona-Bardez-Goa-9038.htm",
    "date": "2023-06-12",
    "description": "On June 10, 2023, Mr. Gabriel Pereira, Organ Donation Ambassador from MOHAN Foundation, was invited to give a talk on organ donation at St. Brid...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9038-stbiohngtk1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Red Cross, Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Red-Cross-Karnal-Haryana-9035.htm",
    "date": "2023-06-09",
    "description": "On 5 th  June 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9035-rckhnatk1.jpg"
  },
  {
    "title": "Awareness talk for nursing staff conducted by Ambassador in  Vadodara",
    "link": "https://www.mohanfoundation.org/activities/Awareness-talk-for-nursing-staff-conducted-by-Ambassador-in-Vadodara-9023.htm",
    "date": "2023-06-03",
    "description": "Organ Donation Ambassador Mr Kalpeshsinh Rathod conducted an organ donation awareness programme for the nursing staff and nursing superviso...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9023-9023-1.jpg"
  },
  {
    "title": "Ambassador uses Facebook to create awareness on organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-uses-Facebook-to-create-awareness-on-organ-donation-9010.htm",
    "date": "2023-05-31",
    "description": "In May 2023 Ambassador Sapna N Sapna created 90 posts (64 – Organ Donation; 14 – Eye donation; 12- Blood donation) on her Faceb...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9010-9010-1.jpg"
  },
  {
    "title": "Organ donation awareness talk for Krsnaa Diagnostic Centres",
    "link": "https://www.mohanfoundation.org/activities/Organ-donation-awareness-talk-for-Krsnaa-Diagnostic-Centres-9017.htm",
    "date": "2023-05-31",
    "description": "On the 29th of May, 2023, an online talk was held by MOHAN Foundation to raise awareness about deceased donor organ donation. A program was orga...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9017-9017.jpeg"
  },
  {
    "title": "Ambassador speaks to dialysis technicians in Vadodara.",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-speaks-to-dialysis-technicians-in-Vadodara-9016.htm",
    "date": "2023-05-31",
    "description": "On May 25, 2023, Ambassador Kalpeshsinh Rathod organised an awareness session for Dialysis technicians at Bhailal Amin General Hospital, Vadodara. 8 ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/9016-9016-1.jpg"
  },
  {
    "title": "Ambassador conducts an Awareness Session at Rani Majra Gurudwara Sahib Mohali, Punjab",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-Awareness-Session-at-Rani-Majra-Gurudwara-Sahib-Mohali-Punjab-8997.htm",
    "date": "2023-05-27",
    "description": "On 22 nd  May 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and Resource person of HP Red Cross organized awareness talk on Organ Donation...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8997-rmgsmptk1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Karan Public School Hansi Road Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Karan-Public-School-Hansi-Road-Karnal-Haryana-8998.htm",
    "date": "2023-05-27",
    "description": "On 22 nd  May 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8998-kpshrkhtk1.jpg"
  },
  {
    "title": "Awareness Session at Haryana Police Academy, Maduban Karnal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Haryana-Police-Academy-Maduban-Karnal-Haryana-by-Ambassador-Dr-Neena-8999.htm",
    "date": "2023-05-27",
    "description": "On 20 th  May 2023, Dr. Neena, Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8999-hpamkhtk1.jpg"
  },
  {
    "title": "Ambassador conducts an Awareness Session at Patanjali Yoga Centre, Kaneshwar Mandir, Sector-7, Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-Awareness-Session-at-Patanjali-Yoga-Centre-Kaneshwar-Mandir-Sector-7-Karnal-Haryana-8991.htm",
    "date": "2023-05-23",
    "description": "On 19 th  May 2023, Dr. Neena, Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8991-apycskht1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session at Red Cross, Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-at-Red-Cross-Karnal-Haryana-8990.htm",
    "date": "2023-05-20",
    "description": "On 18 th  May 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8990-adnrckh1.jpg"
  },
  {
    "title": "Awareness Session on Organ Donation at Gurudwara Sri Guru Teg Bahadur Singh Sabha, Gharaunda, Karnal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-on-Organ-Donation-at-Gurudwara-Sri-Guru-Teg-Bahadur-Singh-Sabha-Gharaunda-Karnal-Haryana-by-Ambassador-Dr-Neena-8988.htm",
    "date": "2023-05-19",
    "description": "On 15 th  April 2023, Dr. Neena, Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fir...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8988-gsggkhant1.jpg"
  },
  {
    "title": "Ambassador invited a faculty at Tirpude College of Social Work, Nagpur",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-invited-a-faculty-at-Tirpude-College-of-Social-Work-Nagpur-8986.htm",
    "date": "2023-05-17",
    "description": "Officiating Principal Dr. Swati Dharmadhikar and the Management of Tirpude College of Social Work, a leading educational institution of Nagpur offeri...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8986-8986-1.jpg"
  },
  {
    "title": "Ambassador Conducts an Awareness Session at Grindwell Norton Ltd, Baddi, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Conducts-an-Awareness-Session-at-Grindwell-Norton-Ltd-Baddi-Himachal-Pradesh-8983.htm",
    "date": "2023-05-15",
    "description": "On 10 th  May 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and Resource person of HP Red Cross organized awareness talk on Organ Donation...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8983-gnlbhpat1.jpg"
  },
  {
    "title": "Ambassador conducts an Awareness Session at Red Cross Karnal, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-Awareness-Session-at-Red-Cross-Karnal-Haryana-8979.htm",
    "date": "2023-05-12",
    "description": "On 9 th  May 2023, Dr. Neena Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer First A...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8979-rckhbantk1.jpg"
  },
  {
    "title": "Awareness Session for the Public of Rajeev Colony, Gharaunda, Karnal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Public-of-Rajeev-Colony-Gharaunda-Karnal-Haryana-by-Ambassador-Dr-Neena-8973.htm",
    "date": "2023-05-06",
    "description": "On 28 th  April 2023, Dr. Neena, Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education, Gharaunda, Haryana, Lay Lecturer Fi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8973-gprcgkhtk1.jpg"
  },
  {
    "title": "Ambassador conducts an Awareness Session at Gandoli Gurudwara Sahib, Punjab",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-Awareness-Session-at-Gandoli-Gurudwara-Sahib-Punjab-8945.htm",
    "date": "2023-04-29",
    "description": "On 24 th  April 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and Resource person of HP Red Cross organized awareness talk on Organ Donati...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8945-ggssdftkp1.jpg"
  },
  {
    "title": "Awareness Session on Organ Donation at Gurudwara Manji Sahib, Karnal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-on-Organ-Donation-at-Gurudwara-Manji-Sahib-Karnal-Haryana-by-Ambassador-Dr-Neena-8948.htm",
    "date": "2023-04-29",
    "description": "On 27 th  April 2023, Dr. Neena, Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fir...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8948-gmskha1.jpg"
  },
  {
    "title": "Awareness Session for the Students of Kumari Vidyavati Anand DAV College for Women, Karnal, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Students-of-Kumari-Vidyavati-Anand-DAV-College-for-Women-Karnal-Haryana-by-Ambassador-Dr-Neena-8940.htm",
    "date": "2023-04-25",
    "description": "On 20 th  April 2023, Dr. Neena, Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education Gharaunda, Haryana, Lay Lecturer Fir...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8940-kvadkhtk1.jpg"
  },
  {
    "title": "Ambassador conducts an Awareness Session for the Students of Shakuntala Devi Foundation at Togan Village, Punjab",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-Awareness-Session-for-the-Students-of-Shakuntala-Devi-Foundation-at-Togan-Village-Punjab-8930.htm",
    "date": "2023-04-21",
    "description": "On 12 th  April 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and Resource person of HP Red Cross organized awareness talk on Organ Donati...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8930-asdftvp1.jpg"
  },
  {
    "title": "Ambassador Dr. Neena conducts an Awareness Session for the Students of B.R.M College of Education, Gharaunda, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Neena-conducts-an-Awareness-Session-for-the-Students-of-BRM-College-of-Education-Gharaunda-Haryana-8935.htm",
    "date": "2023-04-21",
    "description": "On 17 th  April 2023, Dr. Neena, Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education, Gharaunda, Haryana, Lay Lecturer Fi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8935-brmceghtk1.jpg"
  },
  {
    "title": "Awareness Session for the Students of B.R.M College of Education, Gharaunda, Haryana by Ambassador Dr. Neena",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Students-of-BRM-College-of-Education-Gharaunda-Haryana-by-Ambassador-Dr-Neena-8937.htm",
    "date": "2023-04-21",
    "description": "On 18 th  April 2023, Dr. Neena, Ambassador, MOHAN Foundation, Assistant Professor in B.R.M College of Education, Gharaunda, Haryana, Lay Lecturer Fi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8937-brmceght1.jpg"
  },
  {
    "title": "Ambassador creates Organ Donation awareness through MOP Community Radio Station",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-creates-Organ-Donation-awareness-through-MOP-Community-Radio-Station-8889.htm",
    "date": "2023-03-25",
    "description": "On World Kidney Day which is celebrated on the second Thursday of March every year, an awareness interview was recorded in MOP Community Radio Statio...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8889-8889 Interview with Ms Sujatha.jpg"
  },
  {
    "title": "MOHAN Foundation trains the 22nd Batch of Organ Donation Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-trains-the-22nd-Batch-of-Organ-Donation-Ambassadors-8881.htm",
    "date": "2023-03-21",
    "description": "The Module 2 of the Organ Donation Ambassador Training was held on March 18, 2023. It was an online session with 7 trainees. The session was hosted b...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8881-8881 1. Batch 22 - Interaction with experts.jpg"
  },
  {
    "title": "Organ Donation Awareness at Ambai Arts College, Ambasamudram (Tirunelveli District).",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-at-Ambai-Arts-College-Ambasamudram-Tirunelveli-District-8866.htm",
    "date": "2023-03-13",
    "description": "Ambai Arts College is affiliated to the Manonmaniam Sundaranar University, Tirunelveli and stands for the pursuit of sound learning, the buildin...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8866-8866 - Ms Vijayalakshmi explaining the concept of Organ Donation.jpg"
  },
  {
    "title": "Awareness Session organised by Organ Donation Ambassador at Rajan Hospital, Yamuna Nagar, Haryana",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-organised-by-Organ-Donation-Ambassador-at-Rajan-Hospital-Yamuna-Nagar-Haryana-8856.htm",
    "date": "2023-03-11",
    "description": "On 2 nd  March 2023, MOHAN Foundation was invited by Organ Donation Ambassador Ms. Shalini Sharma, to conduct an awareness talk on organ donation for...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8856-odarhhtk1.jpg"
  },
  {
    "title": "Organ Donation Awareness Program at St. Johns College of Education, Tirunelveli District by Ambassador",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-Program-at-St-Johns-College-of-Education-Tirunelveli-District-by-Ambassador-8859.htm",
    "date": "2023-03-11",
    "description": "St. John’s College of Education, Veeravanallur (Tirunelveli District) aims at producing socially inclined, morally, and ethically upright, prof...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8859-8859 - Ms Vijayalakshmi explaining the concept of organ donation.jpg"
  },
  {
    "title": "Ambassador conducts program at Merit College of Education, Tirunelveli District",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-program-at-Merit-College-of-Education-Tirunelveli-District-8858.htm",
    "date": "2023-03-11",
    "description": "An awareness program on understanding of Organ Donation was organized on March 6th, 2023 for the B.Ed.  Students and teaching faculty of Merit C...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8858-8858 Ms Vijayalakshmi explaining the concept of Organ Donation.jpg"
  },
  {
    "title": "Ambassador conducts a mass awareness session in Mangalore",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-a-mass-awareness-session-in-Mangalore-8839.htm",
    "date": "2023-03-04",
    "description": "Ambassador Ms. Marjorie Texeria conducted an awareness session on Organ Donation  at St Agnes College, Mangalore. More than 1500 students partic...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8839-amttkm1.jpg"
  },
  {
    "title": "Ambassador conducts an awareness session at Hi Tech Hospital, Bhubaneshwar",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-awareness-session-at-Hi-Tech-Hospital-Bhubaneshwar-8838.htm",
    "date": "2023-03-04",
    "description": "The President, Akhil Bharatiya Marwadi Mahila Sammilan, Berhampur Sakha, Ms Seema Choudhury an Organ Donation Ambassador was invited to speak on Orga...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8838-hthbtk1.jpg"
  },
  {
    "title": "9th Grader and MOHAN Foundation's Organ Donation Ambassador raises awareness workshop at Oberoi International School, Mumbai",
    "link": "https://www.mohanfoundation.org/activities/9th-Grader-and-MOHAN-Foundations-Organ-Donation-Ambassador-raises-awareness-workshop-at-Oberoi-International-School-Mumbai-8830.htm",
    "date": "2023-02-23",
    "description": "It was a special moment for Ms. Riyaa Palan as she took the stage to speak about a topic that she had taken special interest in and had undergone for...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8830-oismtk1.jpg"
  },
  {
    "title": "MOHAN Foundation-trained Angels of Change Volunteers from Queens Valley School conducted an awareness session on Organ Donation for the teachers",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-trained-Angels-of-Change-Volunteers-from-Queens-Valley-School-conducted-an-awareness-session-on-Organ-Donation-for-the-teachers-8755.htm",
    "date": "2023-01-31",
    "description": "On January 28, 2023, students from Queens Valley School (QVS), Dwarka, who underwent the Foundation’s Angels of Change Volunteers Training on D...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8755-aocqvsdtk1.jpg"
  },
  {
    "title": "Ambassador conducts an awareness session at Stylo Tablewares Pvt. Ltd., Barotiwala, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-awareness-session-at-Stylo-Tablewares-Pvt-Ltd-Barotiwala-Himachal-Pradesh-8770.htm",
    "date": "2023-01-31",
    "description": "On 20 th  January 2023, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation and Resource person of HP Red Cross organized awareness talk on Organ Dona...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8770-stpltkhp.jpg"
  },
  {
    "title": "MOHAN Foundation trains the 21st Batch of Organ Donation Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-trains-the-21st-Batch-of-Organ-Donation-Ambassadors-8754.htm",
    "date": "2023-01-30",
    "description": "Organ Donation Ambassador program of MOHAN Foundation trains lay people to speak about the Organ Donation in the community. The 21st batch&...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8754-21bodat1.jpg"
  },
  {
    "title": "MOHAN Foundation conducts Angels of Change (AOC) Volunteers Training Programme at Queens Valley School, Dwarka, New Delhi",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-conducts-Angels-of-Change-AOC-Volunteers-Training-Programme-at-Queens-Valley-School-Dwarka-New-Delhi-8719.htm",
    "date": "2023-01-17",
    "description": "MOHAN Foundation conducted the Angels of Change volunteer training programme for the students of Queen’s Valley School, Dwarka, New Delhi. It w...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8719-aoc-qvsdnt1.jpg"
  },
  {
    "title": "Ambassador conducts an awareness session at Torrent Pharmaceuticals Limited, Baddi, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-awareness-session-at-Torrent-Pharmaceuticals-Limited-Baddi-Himachal-Pradesh-8715.htm",
    "date": "2023-01-14",
    "description": "On 6 th  January 2023, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and Resource person of HP Red Cross organized awareness talk on Organ Donat...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8715-tplbhpt1.jpg"
  },
  {
    "title": "Ambassador conducts an awareness session for the Employees of Biological E Pharmaceuticals Pvt. Ltd., Poanta Sahib, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-awareness-session-for-the-Employees-of-Biological-E-Pharmaceuticals-Pvt-Ltd-Poanta-Sahib-Himachal-Pradesh-8706.htm",
    "date": "2023-01-04",
    "description": "On 28 th  December 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and Resource person of HP Red Cross organized awareness talk on Organ Don...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8706-ebephpt1.jpg"
  },
  {
    "title": "Ambassador conducts an awareness session at Secure Meters Limited, Barotiwala, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-awareness-session-at-Secure-Meters-Limited-Barotiwala-Himachal-Pradesh-8685.htm",
    "date": "2022-12-28",
    "description": "On 21 st  December 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and resource person of HP Red Cross organized awareness talk on Organ Don...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8685-smlbhptk1.jpg"
  },
  {
    "title": "Distribution of  organ donor cards by Ambassador in Kolhapur",
    "link": "https://www.mohanfoundation.org/activities/Distribution-of-organ-donor-cards-by-Ambassador-in-Kolhapur-8675.htm",
    "date": "2022-12-24",
    "description": "At the end of the year, Organ Donation Ambassador Dr Asha Shitole organised a program on Organ Donation awareness and distribution of donor cards. In...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8675-amktk1.jpg"
  },
  {
    "title": "Ambassador conducts an awareness session at JJM Medical College",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-an-awareness-session-at-JJM-Medical-College-8674.htm",
    "date": "2022-12-23",
    "description": "On Dec 22, 2022, Dr Shilpa AM, Organ Donation Ambassador conducted a talk on Organ Donation. Around 150 MBBS Students and post graduate students of&n...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8674-assjntk1.jpg"
  },
  {
    "title": "Organ Donation awareness talk for members of self help group",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-awareness-talk-for-members-of-self-help-group-8635.htm",
    "date": "2022-12-06",
    "description": "Bro. Siga Social Service Guild (BSSSG) is a registered Non-Profit Organisation founded in the year 1988 working for the development of the community ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8635-bsgctk1.jpg"
  },
  {
    "title": "Ambassadors conduct Awareness at Indian Red Cross Society",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-conduct-Awareness-at-Indian-Red-Cross-Society-8638.htm",
    "date": "2022-12-06",
    "description": "MOHAN Foundation conducted an awareness on Organ Donation  for students at the  Indian Red Cross Society  Tamil Nadu Branch, Nursing A...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8638-irdctk1.jpg"
  },
  {
    "title": "Ambassadors in Udaipur celebrate National Organ Donation Day",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-in-Udaipur-celebrate-National-Organ-Donation-Day-8614.htm",
    "date": "2022-12-03",
    "description": "Scholars Mission of Udaipur organized a poster competition on 27 Nov 2022 to celebrate national Organ Donation Day.  Nearly 20 students  of...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8614-imgnoddt1.jpg"
  },
  {
    "title": "Ambassadors take out a rally in support of Organ Donation in Berhampur.",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-take-out-a-rally-in-support-of-Organ-Donation-in-Berhampur-8615.htm",
    "date": "2022-12-03",
    "description": "Akhil Bharatiya Marwari Mahila Sammelan organized a rally on organ donation in association with all the Innerwheel Clubs of Berhampur to observe Nati...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8615-atrb1.jpg"
  },
  {
    "title": "Ambassador tries an innovative idea to promote  eye donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-tries-an-innovative-idea-to-promote-eye-donation-8617.htm",
    "date": "2022-12-03",
    "description": "Senior member of the Akhil Bharatiya Marwari Mahila Sammelan and leader of the Eye, Organ and Body donation division for Berhampur branch, Ms Sashi M...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8617-edasp1.jpg"
  },
  {
    "title": "Ambassadors celebrate Organ Donation day with Rotary Club in Berhampur, Odisha",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-celebrate-Organ-Donation-day-with-Rotary-Club-in-Berhampur-Odisha-8618.htm",
    "date": "2022-12-03",
    "description": "The Rotary Club of Berhampur organised an talk on Organ Donation on Nov 27, 2022 to celebrateNational Organ Donation day. The Chief guest and speaker...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8618-rtcok1.jpg"
  },
  {
    "title": "National Organ Donation day celebrations by MOHAN Foundation's Life Member and Organ Donation Ambassador",
    "link": "https://www.mohanfoundation.org/activities/National-Organ-Donation-day-celebrations-by-MOHAN-Foundations-Life-Member-and-Organ-Donation-Ambassador-8600.htm",
    "date": "2022-11-30",
    "description": "27 th  November being National Organ Donation Day, an event of Organ Donation awareness campaign was  initiated by MOHAN Foundation and The Caus...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8600-catrtk1.jpg"
  },
  {
    "title": "Awareness at 'Thane Pinkathon Saree Run' by MOHAN Foundation's Organ donation Ambasador",
    "link": "https://www.mohanfoundation.org/activities/Awareness-at-Thane-Pinkathon-Saree-Run-by-MOHAN-Foundations-Organ-donation-Ambasador-8601.htm",
    "date": "2022-11-30",
    "description": "On November 26, 2022, Ms. Jayalakshmi Krishnan, MOHAN Foundation's Volunteer and Organ donation Ambassador organised the 'Thane Pinkathon Saree Run' ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8601-tpsr1.jpg"
  },
  {
    "title": "Ambassador  conducts a program for school students",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducts-a-program-for-school-students-8594.htm",
    "date": "2022-11-29",
    "description": "As an ambassador for MOHAN Foundation, we were given a task to conduct Organ Donation awareness sessions. Little did I  (Dr Ritu Agarwal) know t...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8594-acatk1.jpg"
  },
  {
    "title": "Batch 20 of Organ Donation Ambassadors participate in Module 2.",
    "link": "https://www.mohanfoundation.org/activities/Batch-20-of-Organ-Donation-Ambassadors-participate-in-Module-2-8591.htm",
    "date": "2022-11-28",
    "description": "The Organ Donation Ambassador Training is a three-part module based training. Nursing students of K J Somaiya College of Nursing, Mumbai underwent th...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8591-odatb20-1.jpg"
  },
  {
    "title": "Module 2 of Organ Donation Ambassador Training conducted online",
    "link": "https://www.mohanfoundation.org/activities/Module-2-of-Organ-Donation-AmbassadorTraining-conductedonline-8577.htm",
    "date": "2022-11-22",
    "description": "The Module 2 of Batch 19 of the Organ Donation Ambassador Training was held online on Nov 19, 2022.  33 Nursing students of K J Somaiya School a...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8577-odatm2-nov22-1.jpg"
  },
  {
    "title": "Ambassador conducted Awareness Session at Cassia Resorts, Solan, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducted-Awareness-Session-at-Cassia-Resorts-Solan-Himachal-Pradesh-8572.htm",
    "date": "2022-11-21",
    "description": "On 17 th  November 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and Resource person of HP Red Cross organised awareness talk on Organ Don...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8572-crshptk1.jpg"
  },
  {
    "title": "Awareness Session on Organ Donation conducted at Sentiss Pharma Pvt. Limited, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-on-Organ-Donation-conducted-at-Sentiss-Pharma-Pvt-Limited-Himachal-Pradesh-8563.htm",
    "date": "2022-11-18",
    "description": "On 11 th  November 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation and resource person of HP Red Cross organised awareness talk on Organ Don...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8563-spnhptk1.jpg"
  },
  {
    "title": "Ambassador conducted Awareness Session at Red Cross Society, Shimla, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducted-Awareness-Session-at-Red-Cross-Society-Shimla-Himachal-Pradesh-8553.htm",
    "date": "2022-11-12",
    "description": "On 4 th  November 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organised awareness talk on Organ Donation for the Staff of Red Cross Soci...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8553-rcamtkhp1.jpg"
  },
  {
    "title": "Ambassador conducted Awareness Session for the Students of Govt. Senior Secondary Girls School, Portmore, Shimla",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-conducted-Awareness-Session-for-the-Students-of-Govt-Senior-Secondary-Girls-School-Portmore-Shimla-8544.htm",
    "date": "2022-11-05",
    "description": "On 18 th  October 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organized awareness talk on Organ Donation for the Students of Govt. Senio...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8544-gssapmt1.jpg"
  },
  {
    "title": "Organ Donation Awareness at Indian Institute of Management, Nagpur",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-at-Indian-Institute-of-Management-Nagpur-8506.htm",
    "date": "2022-10-30",
    "description": "During mid-October 2022, Nagpur was host to 32 nd  Annual Conference of The Indian Society of Organ Transplantation, 2 nd  Mid-term Meeting...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8506-imantk1.jpg"
  },
  {
    "title": "Ambassador Conducted Awareness Session for the Employees of NHPC, Jammu & Kashmir",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Conducted-Awareness-Session-for-the-Employees-of-NHPC-Jammu-Kashmir-8445.htm",
    "date": "2022-09-20",
    "description": "On 14 th  September 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organised awareness talk on organ donation for the employees of NHPC, Se...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8445-nsmjktk1.jpg"
  },
  {
    "title": "Awareness Session for the Employees of National Hydroelectric Power Corporation Limited, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Employees-of-National-Hydroelectric-Power-Corporation-Limited-Himachal-Pradesh-8426.htm",
    "date": "2022-09-09",
    "description": "On 3 rd  September 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organised awareness talk on organ donation for the employees of National ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8426-nkhppmt1.jpg"
  },
  {
    "title": "Training of Organ Donation Ambassadors conducted via zoom interaction",
    "link": "https://www.mohanfoundation.org/activities/Training-of-Organ-Donation-Ambassadors-conducted-via-zoom-interaction-8379.htm",
    "date": "2022-08-26",
    "description": "The Organ Donation Ambassador training of the batch 17 was held on Aug 20, 2022 through a zoom meeting.  6 trainees attended the Module 2. ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8379-todamb17-1.jpg"
  },
  {
    "title": "Awareness Session at Steelbird Hi-Tech India Ltd. Baddi, Himachal Pradesh by Ambassador Mrs. Parveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Steelbird-Hi-Tech-India-Ltd-Baddi-Himachal-Pradesh-by-Ambassador-Mrs-Parveen-Mahajan-8303.htm",
    "date": "2022-07-30",
    "description": "On 27 th  July 2022, Mrs. Parveen Mahajan, Ambassador, MOHAN Foundation organised awareness talk on organ donation for the Employees of Steelbird Hi-...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8303-shtlhptba1.jpg"
  },
  {
    "title": "Awareness Session at Satluj Jal Vidyut Nigam, Nathpa Jhakri, Himachal Pradesh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Satluj-Jal-Vidyut-Nigam-Nathpa-Jhakri-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-8282.htm",
    "date": "2022-07-22",
    "description": "On 6 th  July 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organised awareness talk on organ donation for the employees of Satluj Jal Vid...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8282-sjvnnthp1.jpg"
  },
  {
    "title": "Awareness Talk for the Staff of Club Mahindra Resort by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-for-the-Staff-of-Club-Mahindra-Resort-by-Ambassador-Mrs-Praveen-Mahajan-8283.htm",
    "date": "2022-07-22",
    "description": "On 9 th  July 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organised awareness talk on organ donation for the Staff of Club Mahindra Reso...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8283-cmrthpabt2.jpg"
  },
  {
    "title": "Module 2 of batch 16 of Organ Donation Ambassador Training conducted online",
    "link": "https://www.mohanfoundation.org/activities/Module-2-of-batch-16-of-Organ-Donation-Ambassador-Training-conducted-online-8245.htm",
    "date": "2022-06-21",
    "description": "The batch 16 of Ambassador training  (Module 2) was held on June 18, 2022 for 8 trainees. The volunteers were college students as well as one or...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8245-odatb16-1.jpg"
  },
  {
    "title": "Awareness Session for the Employees of Ultratech Cement, Baga, Himachal Pradesh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Employees-of-Ultratech-Cement-Baga-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-8246.htm",
    "date": "2022-06-21",
    "description": "On 18 th  June 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, organized awareness talk on organ donation for the employees of   Ultratech ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8246-utchpt1.jpg"
  },
  {
    "title": "Organ Donation Ambassador organizes online session on organ donation",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-organizes-online-session-on-organ-donation-8247.htm",
    "date": "2022-06-21",
    "description": "On Sunday June19, 2022 the Indian Association of Secretaries and  Administrative Professionals (IASAP) as well as the OLSH Women’s Cell or...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8247-odamtmt1.jpg"
  },
  {
    "title": "Awareness Session for the Employees of Diversey India Hygiene Pvt. Ltd., Himachal Pradesh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Employees-of-Diversey-India-Hygiene-Pvt-Ltd-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-8239.htm",
    "date": "2022-06-14",
    "description": "On 8 th  June 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, organized awareness talk on organ donation for the employees of   Diversey In...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8239-dihnhpt1.jpg"
  },
  {
    "title": "Organ Donation Ambassador training ( batch 15)  for members of ABMMS",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-training-batch-15-for-members-of-ABMMS-8236.htm",
    "date": "2022-06-10",
    "description": "On 8 and 9 June, 2022, an Organ Donation Ambassador training was conducted for 32 members of the Akhil Bhartiya Marwari Mahila  Samellan (ABMMS)...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8236-odamtb15-1.jpg"
  },
  {
    "title": "Awareness Session at Fortune Select Forest Hills, Bhojnagar, Solan, Himachal Pradesh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-at-Fortune-Select-Forest-Hills-Bhojnagar-Solan-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-8193.htm",
    "date": "2022-05-11",
    "description": "On 7 th  May 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organized awareness talk on organ donation for the employees of Fortune Select ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8193-fsfhptba1.jpg"
  },
  {
    "title": "Ambassador creates awareness through Facebook posts",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-creates-awareness-through-Facebook-posts-8163.htm",
    "date": "2022-05-03",
    "description": "In the month of  April, 2022 Ambassador  Sapna N Sapna created  8 posts  on her FaceBook page to create awareness on organ donati...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8163-asnsca1.jpg"
  },
  {
    "title": "Ambassadors of the ABMMS organise a webinar on liver heath on World Liver Day",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-of-the-ABMMS-organise-a-webinar-on-liver-heath-on-World-Liver-Day-8146.htm",
    "date": "2022-04-25",
    "description": "Akhil Bhartiya Marwari Mahila Sammelan (ABMMS) celebrated World Liver Day on April 19, 2022, by organising a webinar to bring our focus on the l...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8146-abmfct1.jpg"
  },
  {
    "title": "Batch 14 of Organ Donation Ambassador training carried out via zoom",
    "link": "https://www.mohanfoundation.org/activities/Batch-14-of-Organ-Donation-Ambassador-training-carried-out-via-zoom-8140.htm",
    "date": "2022-04-18",
    "description": "In continuation of the Organ Donation Ambassador Training, the 2 nd  module of interactions and workshop was held on Satd April 16, 2022. This was an...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8140-atbft1.jpg"
  },
  {
    "title": "Awareness Session for the Employees of Vguard Industries Limited, Himachal Pradesh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Employees-of-Vguard-Industries-Limited-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-8086.htm",
    "date": "2022-03-29",
    "description": "On 26 th  March 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, organized Awareness talk on Organ Donation for the Employees of Vguard Indu...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8086-sdfr1.jpg"
  },
  {
    "title": "Awareness Session for the Employees of Havells India Limited, Himachal Pradesh by Ambassador Mrs. Praveen Mahajan, Session 1",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Employees-of-Havells-India-Limited-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-Session-1-8068.htm",
    "date": "2022-03-22",
    "description": "On 3 rd  March 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organized awareness talk on organ donation for the employees of Havells India...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8068-mthch2.jpg"
  },
  {
    "title": "Awareness Session for the Employees of Havells India Limited, Himachal Pradesh by Ambassador Mrs. Praveen Mahajan, Session 2",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Employees-of-Havells-India-Limited-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-Session-2-8069.htm",
    "date": "2022-03-22",
    "description": "On 5 th  March 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organized awareness talk on organ donation for the Employees of Havells India...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8069-ses1apmt1.jpg"
  },
  {
    "title": "Ambassador Mrs. Praveen Mahajan Conducts Awareness Session for the Employees of Ambuja Cement Limited, Himachal Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Mrs-Praveen-Mahajan-Conducts-Awareness-Session-for-the-Employees-of-Ambuja-Cement-Limited-Himachal-Pradesh-8071.htm",
    "date": "2022-03-22",
    "description": "On 11 th  March 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organized awareness talk on organ donation for the Employees of Ambuja Cemen...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8071-accapmt1.jpg"
  },
  {
    "title": "Awareness Session for the Employees of Adventure Resort Kufri, Shimla by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Session-for-the-Employees-of-Adventure-Resort-Kufri-Shimla-by-Ambassador-Mrs-Praveen-Mahajan-8058.htm",
    "date": "2022-03-12",
    "description": "On 24 th  February 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation, organized awareness talk on organ donation for the Employees of Adventur...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8058-arkst1.jpg"
  },
  {
    "title": "Ambassador writes a chapter on Organ Donation in a book titled ''Adding healthy years beyond retirement''",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-writes-a-chapter-on-Organ-Donation-in-a-book-titled-Adding-healthy-years-beyond-retirement-8038.htm",
    "date": "2022-03-02",
    "description": "Dr. R. N. Hegde, a retired banker trained as an Organ Donation Ambassador in Nov 2021. Recently he authored and published \"Adding healthy years ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8038-ahdbmf1.jpg"
  },
  {
    "title": "Ambassador Madhav designs posters to promote organ donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Madhav-designs-posters-to-promote-organ-donation-8039.htm",
    "date": "2022-03-02",
    "description": "Valentines Day is  celebrated as a time to remember and cherish our loved ones. Ambassador Madhav Agarwal, created a poster to highlight the nee...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8039-amdwt3.jpg"
  },
  {
    "title": "Organ Donation Awareness for the Employees of Pontika Aerotech Limied, Paonta Sahib, Himachal Pradesh by Ambassador Mrs. Praveen Mahajan",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-for-the-Employees-of-Pontika-Aerotech-Limied-Paonta-Sahib-Himachal-Pradesh-by-Ambassador-Mrs-Praveen-Mahajan-8016.htm",
    "date": "2022-02-27",
    "description": "On 20 th  February 2022, Mrs. Praveen Mahajan, Ambassador, MOHAN Foundation organized awareness talk on organ donation for the Employees of Pontika A...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8016-amtchdt1.jpg"
  },
  {
    "title": "Module 2 of Organ Donation Ambassador training conducted in Feb 2022",
    "link": "https://www.mohanfoundation.org/activities/Module-2-of-Organ-Donation-Ambassador-training-conducted-in-Feb-2022-8013.htm",
    "date": "2022-02-27",
    "description": "The Ambassadors program involves three modules  -    Module 1. 4 hour learning - Gift of Life Course   Module 2. 3 hour  virtual int...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/8013-m2odafeb22-1.jpg"
  },
  {
    "title": "Ambassador from Ahmedabad promotes organ donation through her social media posts",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-from-Ahmedabad-promotes-organ-donation-through-her-social-media-posts-7960.htm",
    "date": "2022-02-02",
    "description": "Ms. Sapna, an Organ Donation Ambassador from Ahmedabad is very prolific in her facebook posting. She supports many social causes.  Her posts and...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7960-oda-sapna1.jpg"
  },
  {
    "title": "Module 2 of Organ Donation Ambassador Training conducted for Batch 12",
    "link": "https://www.mohanfoundation.org/activities/Module-2-of-Organ-Donation-Ambassador-Training-conducted-for-Batch-12-7947.htm",
    "date": "2022-01-24",
    "description": "The Module 2 of the Organ Donation Ambassador training held on 22nd January 2022, was attended by 8 participants. The group included 4  students...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7947-oadm2sc1.jpg"
  },
  {
    "title": "Ambassador from Kerala conducts an Online Competition for Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-from-Kerala-conducts-an-Online-Competition-for-Organ-Donation-7927.htm",
    "date": "2022-01-12",
    "description": "In commemoration of National Organ Donation Day – November 26, 2021, Ms. Sreelakshmi a young Organ Donation Ambassador from Kerala, also the fo...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7927-oda-opck1.jpg"
  },
  {
    "title": "Organ and Tissue Donation Awareness at a Womens Convention in Madhya Pradesh",
    "link": "https://www.mohanfoundation.org/activities/Organ-and-Tissue-Donation-Awareness-at-a-Womens-Convention-in-Madhya-Pradesh-7926.htm",
    "date": "2022-01-12",
    "description": "On 5th January 2022, the M.P. National Convention of Akhil Bharatiya Marawari Mahila Sammelan (ABMMS) was held in Mahu, Madhya Pradesh. Mrs Sharda La...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7926-wcmpt1.jpg"
  },
  {
    "title": "Ambassador Partners with NGOs to organise an event for School Teachers",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Partners-with-NGOs-to-organise-an-event-for-School-Teachers-7925.htm",
    "date": "2022-01-12",
    "description": "On 21 st  December 2021, a \"Gift a Life\" event was organized by Scholars Mission for Life,  in association with Rotary Club Vasudha and Happy Ho...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7925-odapwnt1.jpg"
  },
  {
    "title": "Day 2 of Organ Donation Ambassador Training for Members of Akhil Bharatiya Marwari Mahila Sammelan",
    "link": "https://www.mohanfoundation.org/activities/Day-2-of-Organ-Donation-Ambassador-Training-for-Members-of-Akhil-Bharatiya-Marwari-Mahila-Sammelan-7895.htm",
    "date": "2021-12-22",
    "description": "The Day 2 of the Angels of Change/Ambassador Training was held virtually for the members of Akhil Bharatiya Marwari Mahila Sammellan (ABMMS...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7895-odatm2t1.jpg"
  },
  {
    "title": "Organ Donation Ambassador Training for Members of Akhil Bharatiya Marwari Mahila Sammelan",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-Training-for-Members-of-Akhil-Bharatiya-Marwari-Mahila-Sammelan-7887.htm",
    "date": "2021-12-21",
    "description": "The relationship between MOHAN Foundation and Akhil Bharatiya Marwari Mahila Sammelan began in 2019 with joint events to celebrate organ donation day...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7887-amtakbm1.jpg"
  },
  {
    "title": "Seminar on Deceased Organ Donation for Students of Physiotherapy at SRM Institute of Science and Technology",
    "link": "https://www.mohanfoundation.org/activities/Seminar-on-Deceased-Organ-Donation-for-Students-of-Physiotherapy-at-SRM-Institute-of-Science-and-Technology-7863.htm",
    "date": "2021-12-04",
    "description": "As part of the National Organ Donation Day celebrations, MOHAN Foundation organized a seminar at the College of Physiotherapy, SRM Institut...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7863-sitmfct1.jpg"
  },
  {
    "title": "Organ Donation Ambassador Bridgit addresses Members of the Syro Malabar Youth Movement",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-Bridgit-addresses-Members-of-the-Syro-Malabar-Youth-Movement-7820.htm",
    "date": "2021-11-23",
    "description": "Organ Donation Ambassador and Intern of MOHAN Foundation, Ms. Bridgit S, a Medical and Psychiatric Social Work student of Stella Maris College, ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7820-absmtmf1.jpg"
  },
  {
    "title": "Organ Donation Awareness for Students of St Georges College, Kerala",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-for-Students-of-St-Georges-College-Kerala-7819.htm",
    "date": "2021-11-23",
    "description": "Organ Donation Ambassador and Intern of MOHAN Foundation, Ms. Bridgit S, a Medical and Psychiatric Social Work student of Stella Maris College, ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7819-sgcwkt1.jpg"
  },
  {
    "title": "Organ Donation Awareness for Dental Students of SRMDC by Ambassador Rachel Chacko",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-for-Dental-Students-of-SRMDC-by-Ambassador-Rachel-Chacko-7821.htm",
    "date": "2021-11-23",
    "description": "MOHAN Foundation, in collaboration with Stella Maris College and the Department of Public Health Dentistry of SRM Dental College (SRMDC), Ramapuram C...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7821-dssarct1.jpg"
  },
  {
    "title": "Module 2 Training for the 10th Batch of Organ Donation Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/Module-2-Training-for-the-10th-Batch-of-Organ-Donation-Ambassadors-7774.htm",
    "date": "2021-11-01",
    "description": "MOHAN Foundation’s Organ Donation Ambassadors training program is comprised of three modules:      Module 1: 4-hour online learning - Gi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7774-tbodat1.jpg"
  },
  {
    "title": "Ambassador Dr. Eshwar delivers an Awareness Talk on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Dr-Eshwar-delivers-an-Awareness-Talk-on-Organ-Donation-7764.htm",
    "date": "2021-10-30",
    "description": "On 29 th  October 2021, Dr. Eshwar Vasudevan, an organ donation ambassador of MOHAN Foundation from Tiruppur delivered a virtual awareness talk for a...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7764-aeas1.jpg"
  },
  {
    "title": "Ambassador Christy delivers a talk on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Christy-delivers-a-talk-on-Organ-Donation-7713.htm",
    "date": "2021-09-30",
    "description": "Organ donation ambassador and intern of MOHAN Foundation, Ms. Christy C, a student of MMM College of Health Sciences delivered a virtual talk on orga...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7713-odact1.jpg"
  },
  {
    "title": "9th Batch of Organ Donation Ambassadors Trained by MOHAN Foundation",
    "link": "https://www.mohanfoundation.org/activities/9th-Batch-of-Organ-Donation-Ambassadors-Trained-by-MOHAN-Foundation-7635.htm",
    "date": "2021-08-31",
    "description": "MOHAN Foundation’s Organ Donation Ambassadors training program is comprised of three modules:      Module 1: 4-hour online learning - Gi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7635-oda9bt1.jpg"
  },
  {
    "title": "Ambassador Jahnvis Awareness Talk on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Jahnvis-Awareness-Talk-on-Organ-Donation-7623.htm",
    "date": "2021-08-26",
    "description": "As part of the Organ Donation Day celebrations, Ambassador Ms. Jahnvi Mishra of College of Law, Nirma University, Ahmedabad organized a talk on organ...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7623-odajt1.jpg"
  },
  {
    "title": "Interns of MOHAN Foundation conduct a 5-day Public Awareness Campaign",
    "link": "https://www.mohanfoundation.org/activities/Interns-of-MOHAN-Foundation-conduct-a-5-day-Public-Awareness-Campaign-7618.htm",
    "date": "2021-08-23",
    "description": "Five students from MMM College of Health Sciences in Chennai who underwent MOHAN Foundation’s Ambassador program and interned with the organiza...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7618-ipact1.jpg"
  },
  {
    "title": "Awareness Talk by Ambassador Samiksha Ingale",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-by-Ambassador-Samiksha-Ingale-7614.htm",
    "date": "2021-08-22",
    "description": "On August 19th, 2021 Ms Samiksha Ingale, Ambassador of MOHAN Foundation organized a talk on organ donation for her friends and colleagues. Aroun...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7614-aist1.jpg"
  },
  {
    "title": "Organ Donation Awareness for Symbiosis Institute of Health Sciences",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-for-Symbiosis-Institute-of-Health-Sciences-7603.htm",
    "date": "2021-08-21",
    "description": "On 11 th  August 2021, around 100 students pursuing MBA in Hospital & Healthcare Management and their faculty, from the Symbiosis Institute of He...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7603-sihspt1.jpg"
  },
  {
    "title": "Ambassador Sahithi organises Awareness for Students of Symbiosis Institute",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Sahithi-organises-Awareness-for-Students-of-Symbiosis-Institute-7586.htm",
    "date": "2021-08-14",
    "description": "On 12 th  August 2021, Dr. Sahithi Sri B, a Dentist and Postgraduate student of Public Health, and an organ donation ambassador of MOHAN Foundation o...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7586-ambast1.jpg"
  },
  {
    "title": "MOHAN Foundation trains its 8th Batch of Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-trains-its-8th-Batch-of-Ambassadors-7561.htm",
    "date": "2021-07-27",
    "description": "MOHAN Foundation’s Organ Donation Ambassadors training program is comprised of three modules:      Module 1: 4-hour online learning - Gi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7561-odat-b8-1.jpg"
  },
  {
    "title": "Organ Donation Awareness by Ambassador Vijayshri",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-by-Ambassador-Vijayshri-7534.htm",
    "date": "2021-07-13",
    "description": "On July 10 th  2021 at 7 pm, Ambassador Ms. Vijayshri  organised and conducted an awareness session on organ donation. She had in...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7534-odatbvs1.jpg"
  },
  {
    "title": "Awareness Talk on Concepts of Organ Donation by Ambassador Keerthika",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-on-Concepts-of-Organ-Donation-by-Ambassador-Keerthika-7532.htm",
    "date": "2021-07-12",
    "description": "On 8 th  July 2021, organ donation ambassador and intern of MOHAN Foundation, Ms. Keerthika D organised an online awareness session for a group of 52...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7532-odatbk1.jpg"
  },
  {
    "title": "Organ Donation Ambassador Glory Saleesha organizes Awareness Session",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-Glory-Saleesha-organizes-Awareness-Session-7531.htm",
    "date": "2021-07-12",
    "description": "Ms Glory Saleesha V, an intern of MOHAN Foundation and organ donation ambassador delivered an awareness talk on Zoom on 9 th  July 2021. She had invi...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7531-odatbgs1.jpg"
  },
  {
    "title": "Organ Donation Awareness by Ambassador Natalia",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-by-Ambassador-Natalia-7509.htm",
    "date": "2021-06-24",
    "description": "A public awareness programme on organ donation was conducted by Ms Natalia Raaj, as part of the Organ Donation Ambassador training of MOHAN Foun...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7509-odasbynt1.jpg"
  },
  {
    "title": "MOHAN Foundation conducted Batch 7 of Ambassadors Training",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-conducted-Batch-7-of-Ambassadors-Training-7507.htm",
    "date": "2021-06-23",
    "description": "23 participants attended the second module training of Batch 7 of the Ambassadors program on 19 th  June 2021. Students from schools and colleges, nu...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7507-odamb7-1.jpg"
  },
  {
    "title": "Organ Donation Ambassador Dr Viritha delivers Awareness Talk",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-Dr-Viritha-delivers-Awareness-Talk-7508.htm",
    "date": "2021-06-23",
    "description": "Dr Viritha Krishnamurthy, an organ donation ambassador of MOHAN Foundation delivered an awareness talk on organ donation to an audience of 40 which i...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7508-amtbyv-1.jpg"
  },
  {
    "title": "Organ Donation Awareness by Ambassador for The Social Reforms, Chiplun",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-by-Ambassador-for-The-Social-Reforms-Chiplun-7501.htm",
    "date": "2021-06-19",
    "description": "On 17th June 2021, Mr. Shubham Lad - Organ Donation Ambassador, MOHAN Foundation conducted an online session to explain the importance of organ donat...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7501-atbyrp1.jpg"
  },
  {
    "title": "MOHAN Foundation Trains Batch 6 Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-Trains-Batch-6-Ambassadors-7481.htm",
    "date": "2021-05-28",
    "description": "On 22 nd  May 2021, MOHAN Foundation conducted the Module 2 of Organ Donation Ambassadors course for its 6 th  batch of trainees. A total of 18 parti...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7481-odab6t-1.jpg"
  },
  {
    "title": "Batch 5 of Organ Donation Ambassadors Training Conducted",
    "link": "https://www.mohanfoundation.org/activities/Batch-5-of-Organ-Donation-Ambassadors-Training-Conducted-7464.htm",
    "date": "2021-04-22",
    "description": "On April 17 th  2021, MOHAN Foundation conducted the training (Module 2) for the 5 th  batch of Organ Donation Ambassadors. Nine participants compris...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7464-odatb5-1.jpg"
  },
  {
    "title": "Organ Donation Ambassador Parveen Mahajan Educates Employees of Havells Ltd.",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-Parveen-Mahajan-Educates-Employees-of-Havells-Ltd-7437.htm",
    "date": "2021-03-30",
    "description": "Ms. Parveen Mahajan, an organ donation ambassador of MOHAN Foundation educated a group of employees of Havells Ltd. about organ donation. She ad...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7437-apmt1.jpg"
  },
  {
    "title": "Ambassadors in Chennai visit a Skin Bank",
    "link": "https://www.mohanfoundation.org/activities/Ambassadors-in-Chennai-visit-a-Skin-Bank-7435.htm",
    "date": "2021-03-30",
    "description": "On 23 rd  March 2021, four organ donation ambassadors – 2 students from MMM College and 4 postgraduate students from Tagore Medical College, in...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7435-amcsbv.jpg"
  },
  {
    "title": "Organ Donation Ambassador Dr Keerthana delivers an Awareness Talk on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-Dr-Keerthana-delivers-an-Awareness-Talk-on-Organ-Donation-7436.htm",
    "date": "2021-03-30",
    "description": "On 25 th  March 2021, Dr. A Keerthana, a Postgraduate student of Community Medicine at the Tagore Medical College, delivered an awareness talk on org...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7436-odakt1.jpg"
  },
  {
    "title": "MOHAN Foundation Organises Organ Donation Ambassador Training  for its 4th Batch",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-Organises-Organ-Donation-Ambassador-Training-for-its-4th-Batch-7426.htm",
    "date": "2021-03-26",
    "description": "On March 24 th  2021, MOHAN Foundation conducted the 4 th  batch of Organ Donation Ambassador Training (Module 2). 16 participants, comprising s...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7426-oda4bt1.jpg"
  },
  {
    "title": "Ambassador Shubham Lad organises Online Competitions themed on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Shubham-Lad-organises-Online-Competitions-themed-on-Organ-Donation-7425.htm",
    "date": "2021-03-26",
    "description": "An organ donation ambassador of MOHAN Foundation, Shubham, chose to organise online competitions in elocution and poster making to spread awareness a...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7425-odaoc1.jpg"
  },
  {
    "title": "Ambassador Shubham Lad organises a session on Organ Donation for School Students",
    "link": "https://www.mohanfoundation.org/activities/Ambassador-Shubham-Lad-organises-a-session-on-Organ-Donation-for-School-Students-7424.htm",
    "date": "2021-03-26",
    "description": "An awareness talk was arranged at Shree Ramvardayini High School and Jr. College, Nirbade, Khandat - Pali, taluka in Chiplun district of Ratnagiri on...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7424-asls1.jpg"
  },
  {
    "title": "Organ Donation Awareness at St. Theresa of Child Jesus School of Nursing",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-at-St-Theresa-of-Child-Jesus-School-of-Nursing-7428.htm",
    "date": "2021-03-26",
    "description": "An awareness programme organ donation was conducted at St. Theresa of Child Jesus School Of Nursing on 25th March 2021. The program started at 2 pm a...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7428-stcjt1.jpg"
  },
  {
    "title": "Organ Donation Awareness at a School by an Ambassador",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-at-a-School-by-an-Ambassador-7432.htm",
    "date": "2021-03-26",
    "description": "On 25 th  March 2021, Dr. R Nivetha, a MD student of Community Medicine at Tagore Medical College was at the Government Primary and High School, Pana...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7432-oda-talk-drn1.jpg"
  },
  {
    "title": "Organ Donation Ambassadors in Chennai visit an Eye Bank",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassadors-in-Chennai-visit-an-Eye-Bank-7431.htm",
    "date": "2021-03-26",
    "description": "On March 26 th , 2021 a visit to the Lions Eye Bank at the Regional Institute of Ophthalmology, Egmore was organised by MOHAN Foundation. Two interns...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7431-oda-cebv1.jpg"
  },
  {
    "title": "Organ Donation Awareness for Students of MMM College of Health Sciences",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Awareness-for-Students-of-MMM-College-of-Health-Sciences-7427.htm",
    "date": "2021-03-26",
    "description": "Interns and organ donation ambassadors of MOHAN Foundation, Mr. Umarnath P and Mr. Naveen Antony organized an online awareness talk on organ donation...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7427-mmmchsit1.jpg"
  },
  {
    "title": "Awareness Talk by Avinav Jena, an Organ Donation Ambassador of MOHAN Foundation",
    "link": "https://www.mohanfoundation.org/activities/Awareness-Talk-by-Avinav-Jena-an-Organ-Donation-Ambassador-of-MOHAN-Foundation-7415.htm",
    "date": "2021-03-18",
    "description": "Avinav Jena, a 1 st  year L.L.B student at Symbiosis Law School, Hyderabad and an intern at MOHAN Foundation completed the “Gift Of Life”...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7415-atbaj1.jpg"
  },
  {
    "title": "Organ Donation Ambassador Prajal Joshi conducts an Awareness Talk on Organ Donation",
    "link": "https://www.mohanfoundation.org/activities/Organ-Donation-Ambassador-Prajal-Joshi-conducts-an-Awareness-Talk-on-Organ-Donation-7416.htm",
    "date": "2021-03-18",
    "description": "On 10 th  March, Prajal Joshi, an Organ Donation Ambassador of MOHAN Foundation organized an online awareness talk attended by 12 people. A student o...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7416-atbpj1.jpg"
  },
  {
    "title": "Module 2 Training for Second Batch of Organ Donation Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/Module-2-Training-for-Second-Batch-of-Organ-Donation-Ambassadors-7393.htm",
    "date": "2021-03-05",
    "description": "The second module of the organ donation ambassadors programme consisting of interactions with experts, understanding communication and practices of p...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7393-ODATSB8.jpg"
  },
  {
    "title": "MOHAN Foundation trains its Third Batch of Organ Donation Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-trains-its-Third-Batch-of-Organ-Donation-Ambassadors-7394.htm",
    "date": "2021-03-05",
    "description": "A total of 10 participants including students of Symbiosis Law College, Hyderabad and an agriculture student from Kolhapur were trained in the 2...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7394-ODATBT1.jpg"
  },
  {
    "title": "MOHAN Foundation Trains its First Batch of Organ Donation Ambassadors",
    "link": "https://www.mohanfoundation.org/activities/MOHAN-Foundation-Trains-its-First-Batch-of-Organ-Donation-Ambassadors-7392.htm",
    "date": "2021-03-05",
    "description": "MOHAN Foundation’s Organ Donation Ambassadors Programme consists of three modules-    Module 1: Gift of Life Course: 4-hours of e-learnin...",
    "image": "https://www.mohanfoundation.org/images/activity_slideshow/7392-ODA-Session1-1.jpg"
  }
];

let currentStoryPage = 1;
const storiesPerPage = 5;

function renderStories() {
    const container = document.getElementById('stories-container');
    const paginationContainer = document.getElementById('stories-pagination');
    const searchInput = document.getElementById('story-search-input').value.toLowerCase();
    const sortValue = document.getElementById('story-sort-select').value;

    if (!container || !paginationContainer) return;

    // 1. Filter
    const filteredStories = allStoriesData.filter(story => 
        story.title.toLowerCase().includes(searchInput) || 
        story.description.toLowerCase().includes(searchInput)
    );

    // 2. Sort
    filteredStories.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortValue === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // 3. Paginate
    const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
    const startIndex = (currentStoryPage - 1) * storiesPerPage;
    const paginatedStories = filteredStories.slice(startIndex, startIndex + storiesPerPage);

    // 4. Render stories
    container.innerHTML = '';
    if (paginatedStories.length === 0) {
        container.innerHTML = `<p class="text-center text-slate-500 col-span-full">No stories found matching your criteria.</p>`;
    } else {
        paginatedStories.forEach(story => {
            const storyCard = `
                <div class="flex flex-col sm:flex-row gap-6 pb-8 border-b border-slate-100 last:border-0 items-start hover:pl-2 transition-all duration-300 group">
                    <img src="${story.image}" class="w-full sm:w-48 h-32 rounded-xl object-cover shrink-0">
                    <div>
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">${new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <h5 class="font-bold text-black text-xl mb-3"><a href="${story.link}" target="_blank" class="hover:text-mfblue transition">${story.title}</a></h5>
                        <p class="text-base text-black leading-relaxed">${story.description}</p>
                    </div>
                </div>
            `;
            container.innerHTML += storyCard;
        });
    }

    // 5. Render pagination
    paginationContainer.innerHTML = '';
    if (totalPages > 1) { 
        const createButton = (content, page, isDisabled = false, isCurrent = false) => {
            const button = document.createElement('button');
            button.innerHTML = content;
            let baseClasses = 'w-9 h-9 rounded-full font-bold text-sm transition';
            if (isCurrent) {
                button.className = `${baseClasses} bg-mfblue text-white`;
                button.disabled = true;
            } else if (isDisabled) {
                button.className = `${baseClasses} bg-slate-100 text-slate-400 cursor-not-allowed opacity-50`;
                button.disabled = true;
            } else {
                button.className = `${baseClasses} bg-slate-100 hover:bg-mfblue hover:text-white`;
            }
            button.onclick = () => {
                currentStoryPage = page;
                renderStories();
            };
            return button;
        };

        // First & Previous
        paginationContainer.appendChild(createButton('<i class="fa-solid fa-angles-left text-xs"></i>', 1, currentStoryPage === 1));
        paginationContainer.appendChild(createButton('<i class="fa-solid fa-chevron-left text-xs"></i>', currentStoryPage - 1, currentStoryPage === 1));

        const createEllipsis = () => {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            ellipsis.className = 'w-9 h-9 flex items-center justify-center text-slate-500';
            return ellipsis;
        };

        // Page Number Buttons
        const pageWindow = 2;
        let startPage = Math.max(1, currentStoryPage - pageWindow);
        let endPage = Math.min(totalPages, currentStoryPage + pageWindow);

        // Adjust window if near start or end
        if (currentStoryPage - pageWindow <= 2) {
            endPage = Math.min(totalPages, 1 + (pageWindow * 2));
        }
        if (currentStoryPage + pageWindow >= totalPages - 1) {
            startPage = Math.max(1, totalPages - (pageWindow * 2));
        }

        if (startPage > 1) {
            paginationContainer.appendChild(createButton('1', 1));
            if (startPage > 2) {
                paginationContainer.appendChild(createEllipsis());
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createButton(i, i, false, i === currentStoryPage));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationContainer.appendChild(createEllipsis());
            }
            paginationContainer.appendChild(createButton(totalPages, totalPages));
        }

        // Next & Last
        paginationContainer.appendChild(createButton('<i class="fa-solid fa-chevron-right text-xs"></i>', currentStoryPage + 1, currentStoryPage === totalPages));
        paginationContainer.appendChild(createButton('<i class="fa-solid fa-angles-right text-xs"></i>', totalPages, currentStoryPage === totalPages));
    }
}

function setupStories() {
    const searchInput = document.getElementById('story-search-input');
    const sortSelect = document.getElementById('story-sort-select');

    searchInput.addEventListener('input', () => {
        currentStoryPage = 1; // Reset to first page on new search
        renderStories();
    });

    sortSelect.addEventListener('change', () => {
        currentStoryPage = 1; // Reset to first page on sort change
        renderStories();
    });

    // Initial render
    renderStories();
}