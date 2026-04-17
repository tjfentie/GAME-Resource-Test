<script>
document.getElementById('select-all').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.section-toggle');
    checkboxes.forEach(cb => cb.checked = this.checked);
});

async function buildDynamicPDF() {
    const selected = document.querySelectorAll('.section-toggle:checked');
    if (selected.length === 0) {
        alert("Please select at least one module.");
        return;
    }

    const buffer = document.getElementById('print-buffer');
    const btn = document.getElementById('generate-btn');
    buffer.innerHTML = ""; 
    btn.innerText = "⏳ Gathering Content...";

    for (let checkbox of selected) {
        const fileName = checkbox.value;
        // Logic: If filename is 'index', the path is just '../'
        // Otherwise, it's '../filename/'
        const fetchPath = fileName === 'index' ? '../' : `../${fileName}/`;

        try {
            const response = await fetch(fetchPath);
            if (!response.ok) throw new Error(`Status ${response.status}`);
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            
            // Try different possible Material theme content wrappers
            const content = doc.querySelector('.md-content__inner') || 
                            doc.querySelector('article') || 
                            doc.querySelector('.md-typeset');

            if (content) {
                const clone = content.cloneNode(true);
                
                // Remove UI junk from the clones
                const ui = clone.querySelectorAll('.print-button, .mmc-cta-container, .print-selector-ui, script, nav, aside');
                ui.forEach(el => el.remove());

                const sectionWrapper = document.createElement('div');
                sectionWrapper.className = "printable-section";
                sectionWrapper.appendChild(clone);
                buffer.appendChild(sectionWrapper);
            } else {
                console.error(`Could not find content in ${fileName}`);
            }
            
        } catch (err) {
            console.error(`Failed to fetch ${fileName} at ${fetchPath}:`, err);
        }
    }

    btn.innerText = "🖨️ Generate Custom PDF";

    if (buffer.children.length === 0) {
        alert("Error: No content was found. If you are viewing this file locally (not via mkdocs serve), the browser blocks this feature.");
        return;
    }

    setTimeout(() => { window.print(); }, 500);
}
</script>