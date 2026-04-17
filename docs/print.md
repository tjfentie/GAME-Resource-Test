# Custom Resource Builder
Select the modules you want to include in your custom PDF. The system will pull the latest content from each page to build a single, formatted document.

<div class="print-selector-ui">
    <div class="checkbox-group">
        <h3><input type="checkbox" id="select-all"> Select All Modules</h3>
        <hr>
        <label><input type="checkbox" class="section-toggle" value="index"> <strong>Start Here:</strong> Welcome & Intro</label><br>
        <label><input type="checkbox" class="section-toggle" value="alt-access"> <strong>Equipment:</strong> Alternative Access</label><br>
        <label><input type="checkbox" class="section-toggle" value="control-mods"> <strong>Equipment:</strong> Controller Mods</label><br>
        <label><input type="checkbox" class="section-toggle" value="video-game-accessibility"> <strong>Equipment:</strong> Software Features</label><br>
        <label><input type="checkbox" class="section-toggle" value="session-walkthrough"> <strong>Best Practices:</strong> Session Walkthrough</label><br>
        <label><input type="checkbox" class="section-toggle" value="profiles"> <strong>Gamer Profiles:</strong> Success Stories</label><br>
    </div>

    <button id="generate-btn" onclick="buildDynamicPDF()" class="print-button" style="margin-top: 20px; cursor: pointer; position: relative; z-index: 10;">
        🖨️ Generate Custom PDF
    </button>
</div>

<div id="print-buffer"></div>

<script>
// Handle "Select All" logic
document.getElementById('select-all').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.section-toggle');
    checkboxes.forEach(cb => cb.checked = this.checked);
});

async function buildDynamicPDF() {
    const selected = document.querySelectorAll('.section-toggle:checked');
    if (selected.length === 0) {
        alert("Please select at least one section.");
        return;
    }

    const buffer = document.getElementById('print-buffer');
    const btn = document.getElementById('generate-btn');
    
    buffer.innerHTML = ""; 
    const originalText = btn.innerText;
    btn.innerText = "⏳ Gathering Content...";
    btn.style.opacity = "0.5";

    for (let checkbox of selected) {
        const fileName = checkbox.value;
        // Try two possible paths: one folder up or same folder level
        const pathsToTry = fileName === 'index' ? ['../', './'] : [`../${fileName}/`, `./${fileName}/` ];
        let success = false;

        for (let path of pathsToTry) {
            if (success) break;
            try {
                const response = await fetch(path);
                if (!response.ok) continue;
                
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                
                // Grabs the main content area of the Material theme
                const content = doc.querySelector('.md-content__inner') || doc.querySelector('article');
                
                if (content) {
                    const clone = content.cloneNode(true);
                    
                    // Scrub UI elements like buttons and footers from the fetched content
                    const ui = clone.querySelectorAll('.print-button, .mmc-cta-container, .print-selector-ui, script, nav, aside');
                    ui.forEach(el => el.remove());

                    const sectionWrapper = document.createElement('div');
                    sectionWrapper.className = "printable-section";
                    sectionWrapper.appendChild(clone);
                    buffer.appendChild(sectionWrapper);
                    success = true;
                }
            } catch (err) {
                console.warn(`Could not find section at ${path}`);
            }
        }
    }

    btn.innerText = originalText;
    btn.style.opacity = "1";

    if (buffer.children.length === 0) {
        alert("Content not found. If testing locally, ensure you are using 'mkdocs serve'.");
        return;
    }

    // Give browser 500ms to render images/styles before print dialog
    setTimeout(() => {
        window.print();
    }, 500);
}
</script>