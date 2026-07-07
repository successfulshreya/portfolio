// Firebase Configuration (Jo aapki console screen par hai)
const firebaseConfig = {
  apiKey: "AIzaSyC_Zb8sA2IjDhc2iawq_XVyfD_5R213AUU",
  authDomain: "portfolio-f5239.firebaseapp.com",
  projectId: "portfolio-f5239",
  storageBucket: "portfolio-f5239.firebasestorage.app",
  messagingSenderId: "418266799051",
  appId: "1:418266799051:web:ba84b606f496796edbf44e",
  measurementId: "G-87NMC9FF8P"
};

// Initialize Firebase (Non-Module Format)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById('loginBtn');
const adminPanelContainer = document.getElementById('adminPanelContainer');
const projectForm = document.getElementById('projectForm');
const projectsContainer = document.getElementById('projectsContainer');

// 1. Monitor Login State
auth.onAuthStateChanged((user) => {
    if (user && user.email === 'shreyasahuu01@gmail.com') { 
        adminPanelContainer.style.display = 'block';
        loginBtn.textContent = 'Logout';
    } else {
        adminPanelContainer.style.display = 'none';
        loginBtn.textContent = 'Admin Login';
    }
});

// 2. Click Option for Login/Logout
loginBtn.addEventListener('click', () => {
    if (auth.currentUser) {
        auth.signOut().then(() => alert("Logged Out Successfully!"));
    } else {
        const email = prompt("Enter Admin Email:");
        const password = prompt("Enter Password:");
        if(email && password) {
            auth.signInWithEmailAndPassword(email, password)
                .then(() => alert("Welcome back, Shreya!"))
                .catch(err => alert("Access Denied: " + err.message));
        }
    }
});

// 3. Save Project to Cloud Firestore
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newProject = {
        title: document.getElementById('projectTitle').value,
        desc: document.getElementById('projectDescription').value,
        tech: document.getElementById('projectTech').value,
        createdAt: new Date()
    };

    try {
        await db.collection("projects").add(newProject);
        alert("Project Saved Permanently in Cloud Database!");
        projectForm.reset();
        loadDynamicProjects(); 
    } catch (error) {
        alert("Database Error: " + error.message);
    }
});

// 4. Load Projects from Cloud Firestore
async function loadDynamicProjects() {
    if(!projectsContainer) return;
    projectsContainer.innerHTML = ''; 

    try {
        const querySnapshot = await db.collection("projects").get();
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.desc}</p>
                <div class="project-tech">${data.tech.split(',').map(t => `<span>${t.trim()}</span>`).join('')}</div>
            `;
            projectsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading projects: ", error);
    }
}

// Initial Load
loadDynamicProjects();