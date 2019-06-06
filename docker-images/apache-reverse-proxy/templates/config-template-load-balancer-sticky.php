<?php
    $dynamic_app_1 = getenv('DYNAMIC_APP_1');
    $dynamic_app_2 = getenv('DYNAMIC_APP_2');
    $static_app_1  = getenv('STATIC_APP_1');
    $static_app_2  = getenv('STATIC_APP_2');
?>

<VirtualHost *:80>
	ServerName demo.res.ch

	#ErrorLog ${APACHE_LOG_DIR}/error.log
	#CustomLog ${APACHE_LOG_DIR}/access.log combined

    Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED
    <Proxy "balancer://movies">
        BalancerMember "http://<?php print $dynamic_app_1 ?>" route=1
        BalancerMember "http://<?php print $dynamic_app_2 ?>" route=2
        ProxySet stickysession=ROUTEID
    </Proxy>
    ProxyPass        "/api/movies/" "balancer://movies/"
    ProxyPassReverse "/api/movies/" "balancer://movies/"

    <Proxy "balancer://php">
        BalancerMember "http://<?php print $static_app_1 ?>"
        BalancerMember "http://<?php print $static_app_2 ?>"
    </Proxy>
	ProxyPass        "/" "balancer://php/"
	ProxyPassReverse "/" "balancer://php/"

</VirtualHost>
