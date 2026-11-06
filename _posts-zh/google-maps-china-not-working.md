---
title: "为什么Google Maps在中国不能用（2026）——什么真正好用"
excerpt: "Google Maps在中国能打开——然后给你偏了500米的错误方向。这里解释它为什么失败以及两款真正好用的App。"
coverImage: "/assets/blog/google-maps-china-not-working/cover.webp"
date: "2026-03-20T04:57:38+00:00"
dateModified: "2026-06-08T10:12:18+00:00"
author:
  name: "Joy Liu"
  picture: "/brand/founder/avatar-joy.webp"
ogImage:
  url: "/assets/blog/google-maps-china-not-working/cover.webp"
canonical: "https://hiddenchinatravel.com/zh/google-maps-china-not-working"
keywords:
  - "高德地图"
  - "Apple Maps中国"
  - "百度地图"
  - "中国最佳地图App"
  - "中国旅行"
  - "中国旅行贴士"
  - "Google Maps中国"
  - "Google Maps不能用"
  - "中国GPS偏移"
  - "中国地图App"
  - "中国导航"
section: "中国上网"
sourceUrl: "https://hiddenchinatravel.com/google-maps-china-not-working"
translationKey: "google-maps-china-not-working"
status: "published"
---
Google Maps在中国被屏蔽——即使VPN开着，用于实际导航也不可靠。

路线加载不出来。附近地点缺失。当导航方向终于出现时，你照着走结果偏了半条街——有时更远。你困惑地转了几分钟才意识到地图就是……不对。

这不是一个靠更好的VPN就能解决的连接问题。这是一个嵌入中国地图系统运作方式中的坐标问题，影响每一个没有专门为中国市场开发的外国地图App。本指南解释实际发生了什么，并带你从零开始设置高德地图——当地人真正在用的App。

正在为中国之旅准备导航？本指南是我们[中国地图与导航专题](/maps-navigation-in-china)的一部分，涵盖地图App、离线导航、翻译工具以及外国旅行者在地面上遇到的常见问题。

## 为什么Google Maps在中国不能用

有两个问题，它们不同到值得分开说。

**数据问题。** Google在中国不运营，这意味着其中国大陆地图数据是远程维护的，更新不一致。实时交通不可用。商家信息过时。公交路线落后于实际时刻表。在一个新地铁线可能提前三个月通知就开通的国家，这很重要。

**坐标问题。** 中国使用一种叫做GCJ-02的坐标系，法律要求所有在大陆运营的地图服务使用。Google Maps使用全球标准（WGS-84）。两者不匹配——偏移通常为100到500米，取决于你在哪里。

实际中，这意味着你的蓝点显示你站在河里，而你在旁边的桥上。步行导航方向偏离实际街道。你照着路线走结果到了错误的建筑入口。

即使你通过VPN让Google Maps能用，坐标偏移仍然存在于数据本身中。无论连接质量如何，你的蓝点都是错的。用于导航不值得费这个劲。

## 用什么代替

有三款App值得了解。其中一款覆盖大多数场景。

**高德地图（高德地图）**是当地人日常导航用的App。基于中国坐标数据，支持步行、驾车、公交和网约车，有英文界面选项。如果你只装一款地图App就去旅行，就装这个。

**Apple Maps**是iPhone用户最简单的选项。它从本地中国数据提供商获取数据（基于高德），意味着定位准确性可靠。无需设置——在主要城市开箱即用。在偏远地区可靠性下降，但对于北京、上海、成都等同等规模城市，确实好用。

**百度地图**是另一款主要的中国地图App。非常准确，不用高德的人就用这个。界面较杂乱且主要是中文，在Android上安装可能干扰其他App的GPS。作为备用值得拥有，但不是首选。

App| 准确性| 英文支持| 最适合
---|---|---|---
高德地图（Gaode）| 优秀| 部分（可切换）| 全场景——主力App
Apple Maps| 很好| 完整| iPhone用户
百度地图| 优秀| 极少| 备用 / 驾车
Google Maps| 在中国差| 完整| 仅作参考


## 设置高德地图：逐步指南

### 下载

在App Store或Google Play中搜索"Amap"或"高德地图"。图标是白色背景上的红色水滴。在到中国之前下载——不是因为在中国无法下载，而是因为落地后少一件事要处理也好。

_下载后的高德地图主屏幕。_

![Amap home screen in Chinese showing search bar, transit shortcuts and bottom navigation tabs](/assets/blog/google-maps-china-not-working/amap-home-screen-china-navigation-app.webp)

_默认全是中文——搜索栏在底部，有公交、打车、火车票和附近景点的快捷入口。底部导航标签从左到右是：首页、探索、语音搜索、打车和我（我的）。_

### 切换到英文

默认语言是中文。切换方法：

进入**我的（Me）** → **设置（Settings）** → **通用（General）** → **语言（Language）**

![Amap language settings screen showing English option below Simplified Chinese](/assets/blog/google-maps-china-not-working/amap-language-settings-switch-english-scaled.webp)

_语言设置页面。默认选中简体中文（蓝点）。English是第四个选项。点击它，然后完全关闭并重启App——这个页面顶部有提醒让你这样做。_

选择English，然后完全关闭并重新打开App。重启后主界面切换为英文。一些深层菜单仍保持中文，但搜索、路线和公交在设置后都能用英文使用。

### 搜索地点

进入App后，点击搜索栏输入你的目的地。知名地点——酒店、地标、火车站——英文搜索没问题。较小的地点或街道地址，如果有中文名就用中文。从预订确认邮件中直接复制粘贴中文地址到搜索栏是最可靠的方法。

![Amap search results for Lijiang showing Ancient Town with multiple entrance gates and real-time status](/assets/blog/google-maps-china-not-working/amap-search-results-lijiang-ancient-town-scaled.webp)

_搜索丽江（丽江）。结果显示城市、丽江古城（丽江古城）及其多个入口——南门、南门2、北门、东门——以及每个入口的实时状态。这种入口级别的细节是Google Maps对中国景点所不具备的。_

多个入口的分解值得注意。对于丽江古城、故宫或西湖等主要景点，知道_走哪个_入口很重要——尤其如果你预购了指定入口的定时门票。

### 出行：公交路线

点击路线图标（路线）并输入起点和终点。高德地图提供公交、步行、驾车和骑行选项。公交路线详细到地下也能真正有用。

![Amap transit route showing metro Line 6 with exit numbers, door position tip and next train arrival time](/assets/blog/google-maps-china-not-working/amap-metro-transit-directions-exit-numbers-scaled.webp)

_公交路线分解。路线显示：步行1.3公里（20分钟）到蔡家站，从2A口进，乘6号线7站（19分钟）到广电园站，从3B口出。还有一条提示：目的地站左侧开门——所以你知道该站在车厢哪一侧。下一趟车5分钟后到。_

截图中两个细节值得注意。第一，高德地图告诉你在上下车站该走哪个出口——不仅仅是站名。在有10个以上出口分布在不同街道的中国大型地铁站，这节省了实际时间。第二，车厢开门方向提示（左侧开门）意味着你可以在列车停站前就站在出口附近，当你拿着行李或赶时间时很有用。

### 驾车导航

如果你在租车、出租车或自驾，高德地图的导航大概率就是司机在用的。

![Amap driving navigation showing turn-by-turn directions with green route and next instruction at top](/assets/blog/google-maps-china-not-working/amap-driving-navigation-turn-by-turn-scaled.webp)

_驾车导航中。绿色路线清晰，下一步指令（61米后左转进入明泉路）显示在顶部。路线上叠加了实时路况。_

即使设置了英文App语言，导航过程中界面仍保持中文——转弯指令用中文语音播报。如果是别人开车这不太要紧，但如果你在帮司机导航就值得知道。

### 下载离线地图

这一步经常被跳过，然后在地铁隧道里后悔。

进入**我的（Me）** → **工具箱（Toolbox）** → **离线地图（Offline Maps）**

![Amap offline map download screen showing base package and Dali city map with file sizes](/assets/blog/google-maps-china-not-working/amap-offline-map-download-china-scaled.webp)

_离线地图下载页面。App推荐基础功能包（基础功能包，43.9MB地图+12.2MB导航数据），描述为跨城导航必备。下方是当前城市——大理白族自治州（大理白族自治州），14.2MB地图+21.2MB导航。点击右侧下载箭头即可。_

先下载基础功能包——标注为跨城导航必备，总共不到60MB。然后下载你要去的每个城市。城市地图通常每个15–35MB，出发前下载三四个城市在存储上几乎不占什么。

下载后：在地铁隧道中可用，节省移动数据，加载更快，信号在地下餐厅消失时不会停止工作。

## 大多数人搞错的一件事

英文搜索对主要地标没问题，但对于更小的地点——一条具体街道、一家本地餐厅、一座不太知名的寺庙——英文搜索经常返回无结果或错误地点。

解决方法：预订酒店或餐厅时，从确认邮件中复制中文地址直接粘贴到高德地图的搜索栏。不要自己翻译。中文字符精确对应数据库中的内容；音译通常不行。

如果你用滴滴需要设置上车或下车点，同样的原则适用——从你找到该地点的地方粘贴中文地址，而不是输入英文名。[滴滴指南](/how-to-use-didi-china-foreigners)更详细地介绍了这个流程。

## Apple Maps：如果你用iPhone

值得单独说一下因为设置为零。iPhone上的Apple Maps在中国从本地中国数据获取，意味着坐标准确性是正确的——不像Google Maps。在北京、上海、成都、杭州和大多数其他主要城市，步行和公交导航可靠。

客观的限制：在城市以外变薄。对于云南农村、新疆偏远地区或任何远离主要旅游路线的地方，高德地图的数据深度明显更好。但对于城市为主的旅行，Apple Maps为主、高德地图为备用是完全合理的设置。

## 离线备用：Organic Maps

如果你要去任何偏远地区，有一款App值得了解：Organic Maps。免费、开源、完全离线工作，中国数据（来自OpenStreetMap贡献者）对地铁站、寺庙和徒步路线出乎意料地好。

它不能替代高德地图的公交路线或实时导航，但在完全没有信号时作为纯离线地图，它是最可靠的选择。离开Wi-Fi前下载好区域数据。

## 关于上网的说明

即使安装了正确的App，实时路线、实时公交时间和滴滴集成仍需稳定的数据连接。高德地图的离线地图覆盖无信号下的基本需求，但任何需要更新的功能——路况、公交时刻表、滴滴叫车——都需要数据。

如果你还没有搞定上网方案，[中国SIM卡和eSIM指南](/china-sim-card-for-foreigners)介绍了你的选择。大多数旅行者在落地前用eSIM搞定，或在到达机场后买一张本地SIM卡。无论哪种方式，在第一天需要导航之前处理好。

## 常见问题

**用VPN能在中国用Google Maps吗？** 能打开，看起来正常。但由于中国的坐标系问题，定位数据仍偏移最多500米——VPN解决不了这个。任何实际导航请用高德地图或Apple Maps。

**高德地图能用英文吗？** 部分。在设置中切换语言（我的→设置→通用→语言→English，然后重启）后，主界面、搜索和路线都能用英文。一些设置菜单和导航语音仍保持中文。能用——只是不是完美的双语。

**用高德地图需要中国手机号吗？** 不需要。你可以完全不注册就使用高德地图——下载打开即可。注册解锁一些功能如跨设备收藏夹同步，但基本导航不需要。

**Apple Maps在中国能用吗？** 能，而且比大多数人预期的好。它使用本地中国数据所以坐标准确。在主要城市好用；偏远地区可靠性下降。

**高德地图没网能用吗？** 基本地图显示和简单路线可以——如果你下载了该城市的离线地图。实时功能（路况、实时公交时间、滴滴）需要网络连接。

**百度地图怎么样？** 准确、本地开发、数百万人在用。界面主要是中文，且在Android上可能干扰其他App的GPS。值得了解，但高德地图以对外国人更友好的设置覆盖了同样的功能。

**在中国驾车用什么地图App最好？** 高德地图。大多数中国司机都用它，租车导航系统也大多默认使用它。无论你的语言设置如何，导航语音都是中文，但路线显示清晰。

## 相关指南

搞定导航只是拼图的一块。以下指南覆盖其余部分：

  * [中国交通指南（外国人版）](/transport-in-china)——高铁、滴滴、地铁，以及如何支付
  * [在中国如何使用滴滴](/how-to-use-didi-china-foreigners)——不会中文也能叫到车的完整流程
  * [中国SIM卡和eSIM指南](/china-sim-card-for-foreigners)——落地前后在手机上搞定流量
  * [中国上网和VPN指南](/internet-in-china)——什么被屏蔽、什么没有、哪些VPN真正能用
  * [外国人在中国支付指南](/payments-in-china)——支付宝、微信支付以及如何绑定外卡

_最后更新：2026年6月。App界面和功能随更新而变化——截图反映2026年中的高德地图状态。_
