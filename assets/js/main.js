/* =====================================================================
   NEXTIFY TECHNOLOGIES — front-end controller
   jQuery  |  mobile nav  |  counters  |  scroll-reveal  |  FAQ accordion
   AJAX contact form
   ===================================================================== */
(function ($) {
  'use strict';

  /**
   * FORM BACKEND
   * -----------------------------------------------------------
   * php:      posts to handlers/contact-handler.php (needs a PHP server —
   *           Apache/Nginx+PHP, or `php -S`). Use this for any normal host.
   * formspree: posts to a Formspree endpoint (https://formspree.io) —
   *           needed on static hosting that cannot run PHP, such as
   *           GitHub Pages. Sign up free, create a form, and paste your
   *           endpoint ("https://formspree.io/f/xxxxxxxx") below.
   * -----------------------------------------------------------
   */
  const FORM_BACKEND = 'formspree'; // static hosting (GitHub Pages) can't run PHP — use Formspree.
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/your_form_id'; // ← replace after signup, see README-GITHUB-PAGES.md

  function wireMobileNav() {
    const $toggle = $('#navToggle');
    const $nav = $('#mainNav');
    const $backdrop = $('#navBackdrop');

    function close() {
      $nav.removeClass('open');
      $backdrop.removeClass('show');
      $toggle.attr('aria-expanded', 'false');
      $('body').css('overflow', '');
    }
    function open() {
      $nav.addClass('open');
      $backdrop.addClass('show');
      $toggle.attr('aria-expanded', 'true');
      $('body').css('overflow', 'hidden');
    }

    $toggle.on('click', function () {
      $nav.hasClass('open') ? close() : open();
    });
    $backdrop.on('click', close);
    $nav.find('a').on('click', close);
    $(window).on('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function wireBackToTop() {
    const $btn = $('#toTop');
    $(window).on('scroll', debounce(function () {
      $btn.toggleClass('show', $(window).scrollTop() > 480);
    }, 100));
    $btn.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 500);
    });
  }

  function wireScrollReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !targets.length) {
      targets.forEach((el) => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach((el) => io.observe(el));
  }

  /** Animated count-up for elements like <b class="counter" data-count="120" data-suffix="+">0</b> */
  function wireCounters() {
    const els = document.querySelectorAll('.counter');
    if (!els.length) return;

    const animate = (el) => {
      const target = parseFloat(el.dataset.count || '0');
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      els.forEach(animate);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  }

  /** FAQ accordion: <div class="faq-item"><button class="faq-q">...</button><div class="faq-a">...</div></div> */
  function wireFaqAccordion() {
    $('.faq-q').on('click', function () {
      const $item = $(this).closest('.faq-item');
      const isOpen = $item.hasClass('open');
      $item.closest('.faq-list').find('.faq-item.open').not($item).removeClass('open')
        .find('.faq-a').attr('hidden', true);
      $item.toggleClass('open', !isOpen);
      $item.find('.faq-a').attr('hidden', isOpen);
      $(this).attr('aria-expanded', String(!isOpen));
    });
  }

  /** Simple client-side validation helper shared by contact + career forms. */
  function validateForm($form) {
    let valid = true;
    $form.find('[required]').each(function () {
      const $f = $(this);
      const val = ($f.val() || '').toString().trim();
      let ok = val.length > 0;
      if (ok && $f.attr('type') === 'email') {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }
      $f.toggleClass('field-error', !ok);
      if (!ok) valid = false;
    });
    return valid;
  }

  /**
   * Shared submit handler for both forms. Routes to PHP or Formspree
   * depending on FORM_BACKEND, set at the top of this file.
   */
  function wireAjaxForm($form, $status, honeypotId, sendingLabel, successFallback) {
    if (!$form.length) return;
    const $submit = $form.find('[type="submit"]');

    $form.on('submit', function (e) {
      e.preventDefault();
      $status.attr('class', 'form-status').text('');

      if (!validateForm($form)) {
        $status.addClass('is-error').text('Please fill in all required fields correctly.');
        return;
      }
      if ($form.find('#' + honeypotId).val()) {
        return; // honeypot tripped: silently drop
      }

      $submit.prop('disabled', true).data('label', $submit.text()).text(sendingLabel);

      const done = () => $submit.prop('disabled', false).text($submit.data('label'));

      if (FORM_BACKEND === 'formspree') {
        if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.indexOf('your_form_id') !== -1) {
          $status.addClass('is-error').text('Form is not connected yet — set FORMSPREE_ENDPOINT in assets/js/main.js (see README).');
          done();
          return;
        }
        fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData($form[0])
        }).then((res) => {
          if (res.ok) {
            $status.addClass('is-success').text(successFallback);
            $form[0].reset();
          } else {
            return res.json().then((data) => {
              const msg = data && data.errors ? data.errors.map((er) => er.message).join(', ') : null;
              $status.addClass('is-error').text(msg || 'Something went wrong. Please try again.');
            });
          }
        }).catch(() => {
          $status.addClass('is-error').text('Could not reach the server. Please try again, or email us directly.');
        }).finally(done);
      } else {
        $.ajax({
          url: 'handlers/contact-handler.php',
          method: 'POST',
          dataType: 'json',
          data: $form.serialize(),
          timeout: 15000
        }).done(function (res) {
          if (res && res.success) {
            $status.addClass('is-success').text(res.message || successFallback);
            $form[0].reset();
          } else {
            $status.addClass('is-error').text((res && res.message) || 'Something went wrong. Please try again.');
          }
        }).fail(function () {
          $status.addClass('is-error').text('Could not reach the server. Please try again in a moment, or email us directly.');
        }).always(done);
      }
    });
  }

  function wireContactForm() {
    wireAjaxForm($('#contactForm'), $('#contactStatus'), 'companyWebsite', 'Sending…', 'Thanks — your message has been sent.');
  }

  function wireApplyForm() {
    wireAjaxForm($('#applyForm'), $('#applyStatus'), 'applyWebsite', 'Submitting…', 'Thanks — your application has been received.');
  }

  function wireBlogFilter() {
    const $buttons = $('.blog-filter-btn');
    if (!$buttons.length) return;
    $buttons.on('click', function () {
      const cat = $(this).data('cat');
      $buttons.removeClass('active');
      $(this).addClass('active');
      $('.blog-card').each(function () {
        const show = cat === 'all' || $(this).data('cat') === cat;
        $(this).toggle(show);
      });
    });
  }

  function debounce(fn, wait) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  $(function () {
    wireMobileNav();
    wireBackToTop();
    wireScrollReveal();
    wireCounters();
    wireFaqAccordion();
    wireContactForm();
    wireApplyForm();
    wireBlogFilter();
  });

})(jQuery);
