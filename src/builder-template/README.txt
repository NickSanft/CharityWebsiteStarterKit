{{charity_name}} — website files
==================================

Thanks for using the Charity Website Builder!
This zip contains everything you need to publish your site on GitHub Pages.

HOW TO PUBLISH (about 5 minutes)
--------------------------------
1. Create a free GitHub account at https://github.com (if you don't have one).
2. Create a new, empty repository. Name it:
      <your-username>.github.io
   (replacing <your-username> with your actual GitHub username)
3. On your computer, unzip this folder.
4. Drag ALL the files inside (index.html, styles.css, the assets folder, etc.)
   into the new repository on GitHub using the "uploading an existing file" link.
5. Click "Commit changes".
6. Wait 1-2 minutes, then visit:
      https://<your-username>.github.io
   Your site is live!

WHAT'S IN THIS ZIP
------------------
- index.html       Home page
- about.html       About page (if enabled)
- events.html      Events page (if enabled)
- volunteer.html   Volunteer page (if enabled)
- donate.html      Donate page (if enabled)
- blog.html        Blog page (if enabled)
- contact.html     Contact page (if enabled)
- styles.css       All the site styling
- assets/          Logo, favicon, and uploaded images
- CNAME            Custom domain file (if you set one up)

<!--IF:formspree-->
CONTACT FORM
------------
Your contact form is powered by Formspree (form ID: {{formspree_id}}).
Submissions will be emailed to the address you set on formspree.io.

<!--ENDIF-->
CUSTOM DOMAIN SETUP
-------------------
<!--IF:custom_domain-->
A CNAME file pointing to {{custom_domain}} has been included in this zip.
To complete the setup:

1. In your GitHub repository, go to Settings → Pages.
2. Under "Custom domain", enter: {{custom_domain}}
3. With your domain registrar (where you bought the domain), add these DNS records:
   - A CNAME record:  Name = www   Value = <your-username>.github.io
   - OR four A records pointing to GitHub Pages IP addresses:
        185.199.108.153
        185.199.109.153
        185.199.110.153
        185.199.111.153
4. Wait up to 24 hours for DNS propagation. GitHub will also issue a free SSL
   certificate once the domain is verified.

For detailed instructions, see:
https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site

<!--ENDIF-->
<!--IFNOT:custom_domain-->
Want to use your own domain (e.g. www.mycharity.org)?
See: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site

<!--ENDIFNOT-->
UPDATING CONTENT LATER
----------------------
You can edit any .html file directly on GitHub (click the pencil icon on the
file page) or in any text editor on your computer.

Generated {{year}} with the Charity Website Builder.
