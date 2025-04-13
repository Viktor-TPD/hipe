import { Link } from "react-router-dom";
import "./../styles/policy.css";

export default function PrivacyPolicy() {
  return (
    <article className="policy-article">
      <div className="policy-content">
        <h1>Integritetspolicy – Yrgo</h1>
        <p className="last-updated">Gällande från: 04/16/2025</p>
        <p>
          På YRGO värdesätter vi din integritet och är engagerade i att skydda
          din personliga information. Denna integritetspolicy förklarar hur vi
          samlar in, använder och skyddar den information du tillhandahåller när
          du registrerar dig via vår webbplats.
        </p>
        <h2>1. Information vi samlar in</h2>
        <p>
          När du fyller i anmälningsformuläret på vår webbplats samlar vi in
          följande personuppgifter: Ditt namn Ditt företag Din e-postadress Vi
          samlar endast in denna information direkt från dig när du frivilligt
          tillhandahåller den via formuläret.{" "}
        </p>
        <h2>2. Hur vi använder din information</h2>
        <p>
          Vi använder den information du tillhandahåller för följande ändamål:
        </p>
        <ul>
          <li>För att svara på din förfrågan och kommunicera med dig.</li>
          <li>För att ge information du har begärt om vårt företag.</li>
          <li>
            För att hantera anmälningar och kommunikation kring vårt event,
            inklusive bekräftelser och relevant information kopplad till
            evenemanget.
          </li>
        </ul>
        <p>
          Den lagliga grunden för att behandla dina personuppgifter är ditt
          samtycke när du registrerar dig för vårt evenemang, eller vårt
          avtalsförhållande om du ingår i affärskommunikation med oss.
        </p>
        <p>
          Vi lagrar eller behåller inte din personliga information längre än vad
          som är nödvändigt för att uppfylla de ovan angivna ändamålen. Om ingen
          vidare kontakt sker, raderas informationen 14 dagar efter eventet.
        </p>
        <h2>3. Delning av information</h2>
        <p>
          Vi säljer, hyr ut eller byter inte din personliga information till
          tredje part. Vi kan dela din information endast under följande
          begränsade omständigheter: Om det krävs för att uppfylla juridiska
          skyldigheter eller begäran från rättsvårdande myndigheter. För att
          skydda och försvara våra juridiska rättigheter.
        </p>
        <h2>4. Datasäkerhet </h2>
        <p>
          Vi implementerar lämpliga tekniska och organisatoriska åtgärder för
          att skydda din personliga information från obehörig åtkomst,
          avslöjande, ändring eller förstörelse. Dock är ingen metod för
          överföring över internet eller elektronisk lagring helt säker, och vi
          kan inte garantera absolut säkerhet.
        </p>
        <h2>5. Dina integritetsrättigheter</h2>
        <p>Enligt GDPR har du rätt att: </p>
        <ul>
          <li>Få tillgång till de personuppgifter vi behandlar om dig.</li>
          <li>Begära rättelse eller radering av dina personuppgifter.</li>
          <li>Begränsa behandlingen av dina personuppgifter i vissa fall.</li>
          <li>
            Invända mot behandlingen av dina uppgifter i enlighet med GDPR.
          </li>
          <li>
            När som helst återkalla ditt samtycke, utan att det påverkar
            lagligheten av behandling som utförts innan återkallelsen.
          </li>
        </ul>
        <p>
          För att utöva någon av dessa rättigheter, vänligen kontakta oss på
          jullyn0722@skola.goteborg.se eller viktoh0812@skola.goteborg.se
        </p>
        <h2>6. Länkar till tredje part</h2>
        <p>
          Vår webbplats kan innehålla länkar till webbplatser från tredje part.
          Vi ansvarar inte för sekretesspraxis eller innehåll på dessa
          webbplatser. Vi uppmuntrar dig att läsa deras integritetspolicys innan
          du lämnar ut personlig information.
        </p>
        <h2>7. Ändringar i denna integritetspolicy</h2>
        <p>
          Vi förbehåller oss rätten att uppdatera denna integritetspolicy när
          som helst. Ändringar kommer att återspeglas med ett uppdaterat
          "Gällande från"-datum överst på denna sida. Vi uppmuntrar dig att
          granska denna policy regelbundet.
        </p>
        <h2>8. Fotografering och inspelning under eventet</h2>
        <p>
          Observera att vi kan fotografera eller filma under eventet för
          dokumentation och marknadsföring i våra digitala kanaler. Genom att
          delta i eventet ger du samtycke till att vi kan använda bilder och
          filmer på dig. Om du inte önskar att medverka på bild eller film,
          vänligen meddela oss i förväg så att vi kan ta hänsyn till detta.
        </p>
        <h2>9. Kontakta oss</h2>
        <p>
          Om du har några frågor, funderingar eller begäranden relaterade till
          denna integritetspolicy eller vår användning av din information, eller
          om du behöver avboka din anmälan, vänligen kontakta oss på:
        </p>
        <ul>
          <li>E-post: viktoh0812@skola.goteborg.se</li>
          <li>Telefon: +46 730 22 40 35</li>
          <li>Adress: Östra Larmgatan 16</li>
        </ul>
        <p>
          Den personuppgiftsansvarige för behandlingen av dina personuppgifter
          är Yrgo. För frågor om dina rättigheter eller vår hantering av dina
          uppgifter, vänligen kontakta oss via ovanstående kontaktuppgifter.
        </p>

        <div className="policy-actions">
          <Link to="/" className="back-button">
            Jag har läst och förstått integritetspolicyn
          </Link>
        </div>
      </div>
    </article>
  );
}
