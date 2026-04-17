# Custom Resource Builder
Select the modules you want to include in your custom PDF.

<div class="print-selector-ui">
    <div class="checkbox-group">
        <h3><input type="checkbox" id="select-all"> Select All Modules</h3>
        <hr>
        <label><input type="checkbox" class="section-toggle" value="index"> <strong>Start Here:</strong> Welcome & Intro</label><br>
        <label><input type="checkbox" class="section-toggle" value="equipment"> <strong>Equipment:</strong> Overview</label><br>
        <label><input type="checkbox" class="section-toggle" value="alt-access"> <strong>Equipment:</strong> Alternative Access</label><br>
        <label><input type="checkbox" class="section-toggle" value="control-mods"> <strong>Equipment:</strong> Controller Mods</label><br>
        <label><input type="checkbox" class="section-toggle" value="session-walkthrough"> <strong>Best Practices:</strong> Session Walkthrough</label><br>
        <label><input type="checkbox" class="section-toggle" value="profiles"> <strong>Gamer Profiles:</strong> Success Stories</label><br>
    </div>

    <button id="generate-btn" onclick="buildDynamicPDF()" class="print-button" style="margin-top: 20px; cursor: pointer; position: relative; z-index: 10;">
        🖨️ Generate Custom PDF
    </button>
</div>

<div id="print-buffer"></div>

<script>
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
    btn.innerText = "⏳ Gathering Content...";
    btn.style.opacity = "0.5";

    for (let checkbox of selected) {
        const fileName = checkbox.value;
        try {
            // Adjust path if print.md is in a subfolder (e.g. use '../../' if needed)
            const response = await fetch(`../${fileName}/`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            
            // Material for MkDocs uses .md-content__inner
            const content = doc.querySelector('.md-content__inner').cloneNode(true);
            
            // Clean up UI
            const ui = content.querySelectorAll('.print-button, .mmc-cta-container, .print-selector-ui');
            ui.forEach(el => el.remove());

            const sectionWrapper = document.createElement('div');
            sectionWrapper.className = "printable-section";
            sectionWrapper.appendChild(content);
            buffer.appendChild(sectionWrapper);
            
        } catch (err) {
            console.error(`Error fetching ${fileName}:`, err);
        }
    }

    btn.innerText = "🖨️ Generate Custom PDF";
    btn.style.opacity = "1";

    // Small delay to let browser process the new HTML
    setTimeout(() => {
        window.print();
    }, 300);
}
</script>