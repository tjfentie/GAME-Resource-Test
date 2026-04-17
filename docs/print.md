# Full Guide (Print Version)

# Custom Print Builder
Select the sections you want to include in your custom Adaptive Gaming Guide, then click the print button.

<div class="print-selector-ui">
    <div class="checkbox-group">
        <h3><input type="checkbox" id="select-all"> Select All Sections</h3>
        <hr>
        
        <label><input type="checkbox" class="section-toggle" data-section="sec-intro"> <strong>Start Here:</strong> Welcome & Why Gaming Matters</label><br>
        
        <label><input type="checkbox" class="section-toggle" data-section="sec-equip"> <strong>Equipment:</strong> Alternative Access & Mods</label><br>
        
        <label><input type="checkbox" class="section-toggle" data-section="sec-basics"> <strong>Basics:</strong> Picking Games & Literacy</label><br>
        
        <label><input type="checkbox" class="section-toggle" data-section="sec-best"> <strong>Best Practices:</strong> Session Walkthrough</label><br>
    </div>

    <button onclick="prepareAndPrint()" class="print-button" style="margin-top: 20px;">
        🖨️ Generate & Print PDF
    </button>
</div>

<div id="master-print-container">
    <div id="sec-intro" class="printable-content">
        <h1>Welcome to Adaptive Gaming</h1>
        <p>Gaming is the largest entertainment industry...</p>
        <div class="qr"><img src="../images/qr/qr-GAME-vid.png"><p>Scan: Overview Video</p></div>
    </div>

    <div id="sec-equip" class="printable-content">
        <h1>Adaptive Gaming Equipment</h1>
        <p>This section covers switches, joysticks, and mounting...</p>
    </div>

    <div id="sec-basics" class="printable-content">
        <h1>Video Game Basics</h1>
        <p>Understanding game literacy is key...</p>
    </div>

    <div id="sec-best" class="printable-content">
        <h1>Best Practices</h1>
        <p>Follow the session walkthrough for success...</p>
    </div>
</div>

<script>
// Select All functionality
document.getElementById('select-all').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.section-toggle');
    checkboxes.forEach(cb => cb.checked = this.checked);
});

function prepareAndPrint() {
    const toggles = document.querySelectorAll('.section-toggle');
    let anySelected = false;

    toggles.forEach(toggle => {
        const sectionId = toggle.getAttribute('data-section');
        const sectionEl = document.getElementById(sectionId);
        
        if (toggle.checked) {
            sectionEl.classList.add('show-for-print');
            anySelected = true;
        } else {
            sectionEl.classList.remove('show-for-print');
        }
    });

    if (!anySelected) {
        alert("Please select at least one section to print.");
        return;
    }

    window.print();
}
</script>