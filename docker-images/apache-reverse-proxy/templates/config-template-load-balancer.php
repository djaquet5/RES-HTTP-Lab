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

    <Proxy "balancer://movies">
        BalancerMember "http://<?php print $dynamic_app_1 ?>"
        BalancerMember "http://<?php print $dynamic_app_2 ?>"
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
