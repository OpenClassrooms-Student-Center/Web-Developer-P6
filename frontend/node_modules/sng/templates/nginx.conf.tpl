error_log   {{ tmpdir }}/error.log;
pid {{ tmpdir }}/pid;
daemon off;
master_process off;

events {
    worker_connections  4096;
}

http {
    fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
    fastcgi_param  SERVER_SOFTWARE    {{ meta.name }}/{{ meta.version }};
    fastcgi_param  QUERY_STRING       $query_string;
    fastcgi_param  REQUEST_METHOD     $request_method;
    fastcgi_param  CONTENT_TYPE       $content_type;
    fastcgi_param  CONTENT_LENGTH     $content_length;
    fastcgi_param  SCRIPT_FILENAME    $document_root$fastcgi_script_name;
    fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
    fastcgi_param  REQUEST_URI        $request_uri;
    fastcgi_param  DOCUMENT_URI       $document_uri;
    fastcgi_param  DOCUMENT_ROOT      $document_root;
    fastcgi_param  SERVER_PROTOCOL    $server_protocol;
    fastcgi_param  REMOTE_ADDR        $remote_addr;
    fastcgi_param  REMOTE_PORT        $remote_port;
    fastcgi_param  SERVER_ADDR        $server_addr;
    fastcgi_param  SERVER_PORT        $server_port;
    fastcgi_param  SERVER_NAME        $server_name;

    client_body_temp_path {{ tmpdir }}/client_body_temp;
    proxy_temp_path {{ tmpdir }}/proxy_temp;
    fastcgi_temp_path {{ tmpdir }}/fastcgi_temp;
    uwsgi_temp_path {{ tmpdir }}/uwsgi_temp;
    scgi_temp_path {{ tmpdir }}/scgi_temp;

    if_modified_since off;
    log_format mine '$request||$status||$request_length||$request_time||$remote_addr||$bytes_sent';
    access_log  {{ tmpdir }}/access.log mine;

    gzip_types text/plain text/css text/xml text/javascript application/x-javascript;

    server {
        listen {{ nginx_bind }};

        index       index.php index.html index.html;
        root        {{ base }};

        {{ behavior_file }}
    
    }

    types {
        text/html                             html htm shtml;
        text/css                              css;
        text/xml                              xml;
        image/gif                             gif;
        image/jpeg                            jpeg jpg;
        application/x-javascript              js;
        application/atom+xml                  atom;
        application/rss+xml                   rss;

        text/mathml                           mml;
        text/plain                            txt;
        text/vnd.sun.j2me.app-descriptor      jad;
        text/vnd.wap.wml                      wml;
        text/x-component                      htc;

        image/png                             png;
        image/tiff                            tif tiff;
        image/vnd.wap.wbmp                    wbmp;
        image/x-icon                          ico;
        image/x-jng                           jng;
        image/x-ms-bmp                        bmp;
        image/svg+xml                         svg;

        application/java-archive              jar war ear;
        application/mac-binhex40              hqx;
        application/msword                    doc;
        application/pdf                       pdf;
        application/postscript                ps eps ai;
        application/rtf                       rtf;
        application/vnd.ms-excel              xls;
        application/vnd.ms-powerpoint         ppt;
        application/vnd.wap.wmlc              wmlc;
        application/vnd.google-earth.kml+xml  kml;
        application/vnd.google-earth.kmz      kmz;
        application/x-7z-compressed           7z;
        application/x-cocoa                   cco;
        application/x-java-archive-diff       jardiff;
        application/x-java-jnlp-file          jnlp;
        application/x-makeself                run;
        application/x-perl                    pl pm;
        application/x-pilot                   prc pdb;
        application/x-rar-compressed          rar;
        application/x-redhat-package-manager  rpm;
        application/x-sea                     sea;
        application/x-shockwave-flash         swf;
        application/x-stuffit                 sit;
        application/x-tcl                     tcl tk;
        application/x-x509-ca-cert            der pem crt;
        application/x-xpinstall               xpi;
        application/xhtml+xml                 xhtml;
        application/zip                       zip;

        application/octet-stream              bin exe dll;
        application/octet-stream              deb;
        application/octet-stream              dmg;
        application/octet-stream              eot;
        application/octet-stream              iso img;
        application/octet-stream              msi msp msm;

        audio/midi                            mid midi kar;
        audio/mpeg                            mp3;
        audio/ogg                             ogg;
        audio/x-realaudio                     ra;

        video/3gpp                            3gpp 3gp;
        video/mpeg                            mpeg mpg;
        video/quicktime                       mov;
        video/x-flv                           flv;
        video/x-mng                           mng;
        video/x-ms-asf                        asx asf;
        video/x-ms-wmv                        wmv;
        video/x-msvideo                       avi;
    }
}

