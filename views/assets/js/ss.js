(function($) {
    $(function() {

        $('.img-list').each(function() {
            var $this = $(this),
                $group = $this.find('a'),
                name = $this.data('name');
            $group.colorbox({
                rel: name,
                current: '{current} / {total}',
                previous: '<',
                next: '>',
                close: 'x'
            });
        });

    });
})(jQuery);