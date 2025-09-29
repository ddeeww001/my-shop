document.addEventListener('DOMContentLoaded', function(){
    fetch('/template/sidebar.html')
        .then(res => res.text())
        .then(html => document.getElementById('sidebar').innerHTML = html);
})