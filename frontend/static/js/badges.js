function fixPhotoUrl(photo) {
    if (!photo) return null;
    let url = photo.replace(/\\/g, "/");
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (!url.startsWith("/")) url = "/" + url;
    return url;
}

async function renderBadges(userId) {
    if (!userId) {
        console.error("renderBadges: userId its not defined");
        return;
    }

    const featuredName      = document.getElementById("name_insignia_main");
    const featuredDesc      = document.getElementById("description_insignia_main");
    const tagValues         = document.querySelectorAll(".tag-value");
    const badgeGrid         = document.getElementById("badgeGrid");
    const insigniaContainer = document.getElementById("insignia_container");
    const badgeIcon         = document.getElementById("badge");

    try {
        const response = await fetch(`http://127.0.0.1:4000/api/badges/user/${userId}`, {
            credentials: "include",
        });

        if (!response.ok) {
            console.error("Error to obtain badges:", response.status);
            if (badgeGrid) badgeGrid.innerHTML = `<p class="text-white" style="padding:1rem;">Can't load badges.</p>`;
            return;
        }

        const json   = await response.json();
        const badges = json.data || [];

        if (badges.length === 0) {
            if (badgeGrid) badgeGrid.innerHTML = `<p class="text-white" style="padding:1rem;">In this moment you don't have any badges. ¡Continue exploring!</p>`;
            return;
        }

        const latest    = badges[0];
        const latestImg = fixPhotoUrl(latest.photo);

        if (featuredName) featuredName.textContent = latest.name || "";
        if (featuredDesc) featuredDesc.textContent = latest.description || "";

        if (badgeIcon) {
            if (latestImg) {
                badgeIcon.style.display = "none";
                const parent = badgeIcon.parentElement;
                let img = parent.querySelector(".badge-main-img");
                if (!img) {
                    img = document.createElement("img");
                    img.className = "badge-main-img";
                    img.style.cssText = "width:80px;height:80px;object-fit:contain;";
                    parent.insertBefore(img, badgeIcon);
                }
                img.src = latestImg;
                img.alt = latest.name;
                img.id  = "badge";
                badgeIcon.removeAttribute("id");
            }
        }

        if (insigniaContainer) {
            insigniaContainer.innerHTML = latestImg
                ? `<img src="${latestImg}" alt="${latest.name}" style="width:100px;height:100px;object-fit:contain;">`
                : `<i class="bi bi-award-fill" style="font-size:4rem;color:#f59e0b;"></i>`;
        }

        if (tagValues.length >= 3) {
            tagValues[0].textContent = latest.won_at
                ? new Date(latest.won_at).toLocaleDateString("es-ES") : "—";
            tagValues[1].textContent = latest.categories || "—";
            tagValues[2].textContent = latest.points ? `+${latest.points} pts` : "—";
        }

        if (badgeGrid) {
            badgeGrid.innerHTML = badges.map((badge) => {
                const imgUrl = fixPhotoUrl(badge.photo);
                return `
                <div class="badge" data-badge="${badge.name}">
                    <span class="badge-icon">
                        ${imgUrl
                            ? `<img src="${imgUrl}" alt="${badge.name}" style="width:35px;height:35px;object-fit:contain;">`
                            : `<i class="bi bi-award-fill"></i>`}
                    </span>
                    <p class="text-white">${badge.name}</p>
                    <small class="text-white">${badge.categories || ""}</small>
                </div>`;
            }).join("");
        }

        await renderRecentActivity();

    } catch (error) {
        console.error("Error in renderBadges:", error);
    }
}

async function renderRecentActivity() {
    const activityList = document.getElementById("activityList");
    if (!activityList) return;

    try {
        const response = await fetch(`http://127.0.0.1:4000/api/courses/sessions`, {
            credentials: "include",
        });

        if (!response.ok) {
            activityList.innerHTML = `<li style="color:rgba(148,163,184,0.4);font-size:13px;padding:8px 0;">No recent activity yet.</li>`;
            return;
        }

        const json     = await response.json();
        const sessions = json.data || [];

        if (sessions.length === 0) {
            activityList.innerHTML = `<li style="color:rgba(148,163,184,0.4);font-size:13px;padding:8px 0;">No recent activity yet.</li>`;
            return;
        }

        activityList.innerHTML = sessions.map((session) => {
            const courseImg = fixPhotoUrl(session.course_photo);
            const date = session.played_at
                ? new Date(session.played_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                : "—";

            const scoreColor = session.score >= 10
                ? "#4ade80"
                : session.score >= 5
                    ? "#f59e0b"
                    : "#94a3b8";

            return `
            <li style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                <div style="width:40px;height:40px;border-radius:10px;overflow:hidden;flex-shrink:0;background:rgba(6,249,249,0.08);border:1px solid rgba(6,249,249,0.15);display:flex;align-items:center;justify-content:center;">
                    ${courseImg
                        ? `<img src="${courseImg}" alt="${session.course_title}" style="width:100%;height:100%;object-fit:cover;">`
                        : `<i class="bi bi-controller" style="color:#06f9f9;font-size:18px;"></i>`}
                </div>
                <div style="flex:1;min-width:0;">
                    <p style="margin:0;font-size:13px;font-weight:600;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                        ${session.course_title || "Course"}
                    </p>
                    <div style="display:flex;align-items:center;gap:6px;margin-top:3px;">
                        <span style="font-size:10px;color:rgba(148,163,184,0.5);">
                            <i class="bi bi-joystick" style="margin-right:3px;"></i>${session.game_name || "Game"}
                        </span>
                        <span style="color:rgba(148,163,184,0.3);font-size:10px;">·</span>
                        <span style="font-size:10px;font-weight:700;color:${scoreColor};">
                            ${session.score} pts
                        </span>
                    </div>
                </div>
                <span style="font-size:10px;color:rgba(148,163,184,0.4);flex-shrink:0;text-align:right;">${date}</span>
            </li>`;
        }).join("");

    } catch (error) {
        console.error("Error in renderRecentActivity:", error);
    }
}