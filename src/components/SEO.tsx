import { useEffect } from 'react';
import { RESTAURANT_INFO, OPENING_HOURS } from '../data';

export default function SEO() {
  useEffect(() => {
    // 1. Set document title and standard meta tags
    document.title = 'Trattoria del Corso | Ristorante Tipico Umbro a Foligno (PG)';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', RESTAURANT_INFO.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = RESTAURANT_INFO.description;
      document.head.appendChild(meta);
    }

    // Set keywords for local search optimization
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content',
      'Trattoria del Corso Foligno, Ristorante Foligno, Trattoria Foligno, Dove mangiare Foligno, Cucina tipica umbra Foligno, Ristorante Corso Cavour Foligno, Forno a legna Foligno, Primi piatti Foligno, Gnocchi al Sagrantino, Rocciata Foligno, Norcina Foligno, Piatti tipici umbri'
    );

    // Open Graph for social sharing
    const ogTags = [
      { property: 'og:title', content: 'Trattoria del Corso | Ristorante Tipico a Foligno' },
      { property: 'og:description', content: RESTAURANT_INFO.description },
      { property: 'og:type', content: 'restaurant.restaurant' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: `${window.location.origin}/src/assets/images/trattoria_interior_1784596711657.jpg` },
      { property: 'restaurant:section', content: 'Cucina Umbra' },
      { property: 'restaurant:contact_info:street_address', content: 'Corso Camillo Benso Conte di Cavour, 54' },
      { property: 'restaurant:contact_info:locality', content: 'Foligno' },
      { property: 'restaurant:contact_info:region', content: 'PG' },
      { property: 'restaurant:contact_info:postal_code', content: '06034' },
      { property: 'restaurant:contact_info:country_name', content: 'Italia' },
      { property: 'restaurant:contact_info:phone_number', content: RESTAURANT_INFO.phone },
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

    /*
     * Structured Schema.org JSON-LD data for Google Local SEO
     */
    const schemaOrg = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      '@id': `${window.location.origin}/#trattoria-del-corso`,
      'name': RESTAURANT_INFO.name,
      'image': [
        `${window.location.origin}/src/assets/images/trattoria_interior_1784596711657.jpg`,
        `${window.location.origin}/src/assets/images/umbrian_tagliere_1784596724444.jpg`,
        `${window.location.origin}/src/assets/images/rocciata_dolce_1784596736743.jpg`
      ],
      'telephone': RESTAURANT_INFO.phone,
      'url': window.location.origin,
      'priceRange': '$$',
      'servesCuisine': 'Italiana, Umbra, Tradizionale, Forno a Legna',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Corso Camillo Benso Conte di Cavour, 54',
        'addressLocality': 'Foligno',
        'addressRegion': 'PG',
        'postalCode': '06034',
        'addressCountry': 'IT'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': RESTAURANT_INFO.coordinates.lat,
        'longitude': RESTAURANT_INFO.coordinates.lng
      },
      'openingHoursSpecification': OPENING_HOURS.map(sched => {
        const days = [
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ];
        const dayOfWeek = days[sched.dayCode];

        const specs = [];
        if (sched.lunch) {
          specs.push({
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': dayOfWeek,
            'opens': sched.lunch.open,
            'closes': sched.lunch.close
          });
        }
        if (sched.dinner) {
          specs.push({
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': dayOfWeek,
            'opens': sched.dinner.open,
            'closes': sched.dinner.close
          });
        }
        return specs;
      }).flat(),
      'acceptsReservations': 'True',
      'menu': `${window.location.origin}/#menu`
    };

    // BreadcrumbList schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': `${window.location.origin}/#home`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Menù',
          'item': `${window.location.origin}/#menu`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'Galleria',
          'item': `${window.location.origin}/#galleria`
        },
        {
          '@type': 'ListItem',
          'position': 4,
          'name': 'Contatti',
          'item': `${window.location.origin}/#contatti`
        }
      ]
    };

    // WebSite + SearchAction schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': RESTAURANT_INFO.name,
      'url': `${window.location.origin}/`,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${window.location.origin}/?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    let scriptTag = document.getElementById('json-ld-restaurant') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-restaurant';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaOrg, null, 2);

    let breadcrumbTag = document.getElementById('json-ld-breadcrumb') as HTMLScriptElement;
    if (!breadcrumbTag) {
      breadcrumbTag = document.createElement('script');
      breadcrumbTag.id = 'json-ld-breadcrumb';
      breadcrumbTag.type = 'application/ld+json';
      document.head.appendChild(breadcrumbTag);
    }
    breadcrumbTag.text = JSON.stringify(breadcrumbSchema, null, 2);

    let websiteTag = document.getElementById('json-ld-website') as HTMLScriptElement;
    if (!websiteTag) {
      websiteTag = document.createElement('script');
      websiteTag.id = 'json-ld-website';
      websiteTag.type = 'application/ld+json';
      document.head.appendChild(websiteTag);
    }
    websiteTag.text = JSON.stringify(websiteSchema, null, 2);

    return () => {
      // Keep script tag on page so Google extracts it, but clean up duplicate checks if re-rendered
    };
  }, []);

  return null; // This is a headless utility component
}
