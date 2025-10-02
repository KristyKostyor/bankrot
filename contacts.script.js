document.write(`
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Главная",
          "item": "https://bezdolgov.netlify.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Контакты",
          "item": "https://bezdolgov.netlify.app/contacts"
        }
      ]
    }
    </script>
    `);
    