# Custom Resource Builder
Select the modules you want to include in your custom PDF. The system will pull the latest content from the site to build your document.

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

    <button onclick="buildDynamicPDF()" class="print-button" style="margin-top: 20px;">
        🖨️ Generate Custom PDF
    </button>
</div>

<div id="print-buffer" style="display:none;"></div>

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
    buffer.innerHTML = ""; // Clear old data
    
    // Show a loading state
    const btn = document.querySelector('.print-button');
    const originalText = btn.innerText;
    btn.innerText = "⏳ Gathering Content...";

    for (let checkbox of selected) {
        const fileName = checkbox.value;
        try {
            // Fetch the page. MkDocs generates folders, so 'equipment' becomes 'equipment/index.html'
            // or just '../equipment/' depending on your use_directory_urls setting.
            const response = await fetch(`../${fileName}/`);
            const html = await response.text();
            
            // Parse the HTML to find the main content (usually inside .md-content__inner)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const content = doc.querySelector('.md-content__inner').cloneNode(true);
            
            // Remove the 'Print' button and UI from the fetched content so it's not doubled
            const uiElements = content.querySelectorAll('.print-button, .mmc-cta-container');
            uiElements.forEach(el => el.remove());

            // Add a wrapper with a page break
            const sectionWrapper = document.createElement('div');
            sectionWrapper.className = "printable-section";
            sectionWrapper.appendChild(content);
            buffer.appendChild(sectionWrapper);
            
        } catch (err) {
            console.error(`Could not fetch ${fileName}:`, err);
        }
    }

    btn.innerText = originalText;
    window.print();
}
</script>