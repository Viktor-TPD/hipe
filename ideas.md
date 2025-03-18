1. users
   - _id
   - email
   - password (hashad)
   - userType (student/företag)

2. studentProfiles
   - _id
   - userId (referens till users)
   - namn
   - klass id
   DD
   - inriktning 1
   - mjukvara 
   QU
   - stack
   - språk
   - CV/portfolio (länk)

3. companyProfiles
   - _id
   - userId (referens till users)
   - företagsnamn
   - bransch
   - beskrivning nullable
   kontaktperson 
   - name 
   - mail
   - internship (fritext)

4. liked
   - _id
   - studentId (ref till student table)
   - companyId (ref till company table)
   - isPoked (bool)
   - datum