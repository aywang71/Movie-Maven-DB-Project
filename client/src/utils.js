export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const getYear = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export const capitalizeWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

export const formatMoney = (budget) => {
  const abs = Math.abs(Number(budget));
  return '$' + (
    abs >= 1.0e+9
      ? (abs / 1.0e+9).toFixed(1) + 'B'
      : abs >= 1.0e+6
        ? (abs / 1.0e+6).toFixed(1) + 'M'
        : abs >= 1.0e+3
          ? (abs / 1.0e+3).toFixed(1) + 'K'
          : abs
  );
};

export const genres = [
  'Action', 
  'Adventure', 
  'Animation', 
  'Comedy', 
  'Crime', 
  'Documentary', 
  'Drama', 
  'Family', 
  'Fantasy', 
  'History', 
  'Horror', 
  'Music', 
  'Mystery', 
  'Romance', 
  'Science Fiction', 
  'Thriller', 
  'TV Movie', 
  'War', 
  'Western'
];

export const providers = [
  {
    "provider": "A&E Crime Central Apple TV Channel",
    "platform_id": 2033
  },
  {
    "provider": "Acorn TV",
    "platform_id": 87
  },
  {
    "provider": "Acorn TV Apple TV",
    "platform_id": 2034
  },
  {
    "provider": "AcornTV Amazon Channel",
    "platform_id": 196
  },
  {
    "provider": "AD tv",
    "platform_id": 1958
  },
  {
    "provider": "aha",
    "platform_id": 532
  },
  {
    "provider": "ALLBLK Apple TV channel",
    "platform_id": 2036
  },
  {
    "provider": "Amazon Prime Video",
    "platform_id": 9
  },
  {
    "provider": "Amazon Video",
    "platform_id": 10
  },
  {
    "provider": "AMC",
    "platform_id": 80
  },
  {
    "provider": "AMC on Demand",
    "platform_id": 352
  },
  {
    "provider": "AMC Plus Apple TV Channel ",
    "platform_id": 1854
  },
  {
    "provider": "AMC+",
    "platform_id": 526
  },
  {
    "provider": "AMC+ Amazon Channel",
    "platform_id": 528
  },
  {
    "provider": "AMC+ Roku Premium Channel",
    "platform_id": 635
  },
  {
    "provider": "Angel Studios",
    "platform_id": 1956
  },
  {
    "provider": "Apple TV",
    "platform_id": 2
  },
  {
    "provider": "Apple TV Plus",
    "platform_id": 350
  },
  {
    "provider": "ARROW",
    "platform_id": 529
  },
  {
    "provider": "AsianCrush",
    "platform_id": 514
  },
  {
    "provider": "BBC America",
    "platform_id": 397
  },
  {
    "provider": "Bet+",
    "platform_id": 1759
  },
  {
    "provider": "BET+  Apple TV channel",
    "platform_id": 2040
  },
  {
    "provider": "Bet+ Amazon Channel",
    "platform_id": 343
  },
  {
    "provider": "Boomerang",
    "platform_id": 248
  },
  {
    "provider": "Boomerang Amazon Channel",
    "platform_id": 288
  },
  {
    "provider": "BritBox",
    "platform_id": 151
  },
  {
    "provider": "BritBox Amazon Channel",
    "platform_id": 197
  },
  {
    "provider": "Britbox Apple TV Channel ",
    "platform_id": 1852
  },
  {
    "provider": "BroadwayHD",
    "platform_id": 554
  },
  {
    "provider": "Carnegie Hall+ Amazon Channel",
    "platform_id": 2071
  },
  {
    "provider": "Carnegie Hall+ Apple TV Channel",
    "platform_id": 2042
  },
  {
    "provider": "Chai Flicks",
    "platform_id": 438
  },
  {
    "provider": "Cinemax Amazon Channel",
    "platform_id": 289
  },
  {
    "provider": "Cinemax Apple TV Channel",
    "platform_id": 2061
  },
  {
    "provider": "Cineverse",
    "platform_id": 1957
  },
  {
    "provider": "Classix",
    "platform_id": 445
  },
  {
    "provider": "Cohen Media Amazon Channel",
    "platform_id": 1811
  },
  {
    "provider": "Comedy Central",
    "platform_id": 243
  },
  {
    "provider": "Crackle",
    "platform_id": 12
  },
  {
    "provider": "Criterion Channel",
    "platform_id": 258
  },
  {
    "provider": "Crunchyroll",
    "platform_id": 283
  },
  {
    "provider": "Crunchyroll Amazon Channel",
    "platform_id": 1968
  },
  {
    "provider": "Cultpix",
    "platform_id": 692
  },
  {
    "provider": "Curiosity Stream",
    "platform_id": 190
  },
  {
    "provider": "CuriosityStream Apple TV Channel",
    "platform_id": 2060
  },
  {
    "provider": "Darkmatter TV",
    "platform_id": 355
  },
  {
    "provider": "Dekkoo",
    "platform_id": 444
  },
  {
    "provider": "DIRECTV",
    "platform_id": 358
  },
  {
    "provider": "Discovery+ Amazon Channel",
    "platform_id": 584
  },
  {
    "provider": "Disney Plus",
    "platform_id": 337
  },
  {
    "provider": "DisneyNOW",
    "platform_id": 508
  },
  {
    "provider": "DistroTV",
    "platform_id": 1971
  },
  {
    "provider": "DocAlliance Films",
    "platform_id": 569
  },
  {
    "provider": "DOCSVILLE",
    "platform_id": 475
  },
  {
    "provider": "Dogwoof On Demand",
    "platform_id": 536
  },
  {
    "provider": "Eros Now",
    "platform_id": 218
  },
  {
    "provider": "Eros Now Select Apple TV Channel",
    "platform_id": 2059
  },
  {
    "provider": "Eventive",
    "platform_id": 677
  },
  {
    "provider": "Fandor",
    "platform_id": 25
  },
  {
    "provider": "Fandor Amazon Channel",
    "platform_id": 199
  },
  {
    "provider": "Film Movement Plus",
    "platform_id": 579
  },
  {
    "provider": "FilmBox+",
    "platform_id": 701
  },
  {
    "provider": "FILMRISE",
    "platform_id": 471
  },
  {
    "provider": "Filmzie",
    "platform_id": 559
  },
  {
    "provider": "Flix Premiere",
    "platform_id": 432
  },
  {
    "provider": "FlixFling",
    "platform_id": 331
  },
  {
    "provider": "Freeform",
    "platform_id": 211
  },
  {
    "provider": "Freevee",
    "platform_id": 613
  },
  {
    "provider": "fuboTV",
    "platform_id": 257
  },
  {
    "provider": "Full Moon Amazon Channel",
    "platform_id": 597
  },
  {
    "provider": "Funimation Now",
    "platform_id": 269
  },
  {
    "provider": "FXNow",
    "platform_id": 123
  },
  {
    "provider": "GlewedTV",
    "platform_id": 1990
  },
  {
    "provider": "Google Play Movies",
    "platform_id": 3
  },
  {
    "provider": "GuideDoc",
    "platform_id": 100
  },
  {
    "provider": "Hallmark Movies Now Amazon Channel",
    "platform_id": 290
  },
  {
    "provider": "Hallmark Movies Now Apple TV Channel",
    "platform_id": 2058
  },
  {
    "provider": "HBO Max",
    "platform_id": 384
  },
  {
    "provider": "Here TV",
    "platform_id": 417
  },
  {
    "provider": "Hi-YAH",
    "platform_id": 503
  },
  {
    "provider": "HiDive",
    "platform_id": 430
  },
  {
    "provider": "History",
    "platform_id": 155
  },
  {
    "provider": "History Vault",
    "platform_id": 268
  },
  {
    "provider": "HISTORY Vault Amazon Channel",
    "platform_id": 2073
  },
  {
    "provider": "HISTORY Vault Apple TV Channel",
    "platform_id": 2057
  },
  {
    "provider": "Hoichoi",
    "platform_id": 315
  },
  {
    "provider": "Hoopla",
    "platform_id": 212
  },
  {
    "provider": "Hulu",
    "platform_id": 15
  },
  {
    "provider": "IFC Films Unlimited Apple TV Channel",
    "platform_id": 2056
  },
  {
    "provider": "IndieFlix",
    "platform_id": 368
  },
  {
    "provider": "iQIYI",
    "platform_id": 581
  },
  {
    "provider": "Kanopy",
    "platform_id": 191
  },
  {
    "provider": "Kino Now",
    "platform_id": 640
  },
  {
    "provider": "Klassiki",
    "platform_id": 1793
  },
  {
    "provider": "Kocowa",
    "platform_id": 464
  },
  {
    "provider": "KoreaOnDemand",
    "platform_id": 575
  },
  {
    "provider": "Laugh Out Loud",
    "platform_id": 275
  },
  {
    "provider": "Lifetime",
    "platform_id": 157
  },
  {
    "provider": "Lifetime Movie Club",
    "platform_id": 284
  },
  {
    "provider": "Lifetime Movie Club Amazon Channel",
    "platform_id": 2089
  },
  {
    "provider": "Lifetime Movie Club Apple TV Channel",
    "platform_id": 2055
  },
  {
    "provider": "Magellan TV",
    "platform_id": 551
  },
  {
    "provider": "Max",
    "platform_id": 1899
  },
  {
    "provider": "Max Amazon Channel",
    "platform_id": 1825
  },
  {
    "provider": "Metrograph",
    "platform_id": 585
  },
  {
    "provider": "MGM Plus",
    "platform_id": 34
  },
  {
    "provider": "MGM Plus Amazon Channel",
    "platform_id": 583
  },
  {
    "provider": "MGM Plus Roku Premium Channel",
    "platform_id": 636
  },
  {
    "provider": "Microsoft Store",
    "platform_id": 68
  },
  {
    "provider": "Midnight Pulp",
    "platform_id": 1960
  },
  {
    "provider": "MovieSaints",
    "platform_id": 562
  },
  {
    "provider": "MUBI",
    "platform_id": 11
  },
  {
    "provider": "MUBI Amazon Channel",
    "platform_id": 201
  },
  {
    "provider": "myfilmfriend",
    "platform_id": 1972
  },
  {
    "provider": "MZ Choice Amazon Channel",
    "platform_id": 291
  },
  {
    "provider": "National Geographic",
    "platform_id": 1964
  },
  {
    "provider": "Netflix",
    "platform_id": 8
  },
  {
    "provider": "Netflix basic with Ads",
    "platform_id": 1796
  },
  {
    "provider": "Netflix Kids",
    "platform_id": 175
  },
  {
    "provider": "Night Flight Plus",
    "platform_id": 455
  },
  {
    "provider": "Noggin Amazon Channel",
    "platform_id": 262
  },
  {
    "provider": "Noggin Apple TV Channel",
    "platform_id": 2032
  },
  {
    "provider": "Outside Watch",
    "platform_id": 1976
  },
  {
    "provider": "OUTtv Apple TV Channel",
    "platform_id": 2044
  },
  {
    "provider": "OVID",
    "platform_id": 433
  },
  {
    "provider": "Pantaflix",
    "platform_id": 177
  },
  {
    "provider": "Paramount Plus",
    "platform_id": 531
  },
  {
    "provider": "Paramount Plus Apple TV Channel ",
    "platform_id": 1853
  },
  {
    "provider": "Paramount+ Amazon Channel",
    "platform_id": 582
  },
  {
    "provider": "Paramount+ Roku Premium Channel",
    "platform_id": 633
  },
  {
    "provider": "Paramount+ with Showtime",
    "platform_id": 1770
  },
  {
    "provider": "PBS",
    "platform_id": 209
  },
  {
    "provider": "PBS Kids Amazon Channel",
    "platform_id": 293
  },
  {
    "provider": "PBS Masterpiece Amazon Channel",
    "platform_id": 294
  },
  {
    "provider": "Peacock",
    "platform_id": 386
  },
  {
    "provider": "Peacock Premium",
    "platform_id": 387
  },
  {
    "provider": "Plex",
    "platform_id": 538
  },
  {
    "provider": "Plex Player",
    "platform_id": 1945
  },
  {
    "provider": "Pluto TV",
    "platform_id": 300
  },
  {
    "provider": "Popcornflix",
    "platform_id": 241
  },
  {
    "provider": "Popflick",
    "platform_id": 1832
  },
  {
    "provider": "Public Domain Movies",
    "platform_id": 638
  },
  {
    "provider": "Pure Flix",
    "platform_id": 278
  },
  {
    "provider": "Rakuten Viki",
    "platform_id": 344
  },
  {
    "provider": "Redbox",
    "platform_id": 279
  },
  {
    "provider": "Retrocrush",
    "platform_id": 446
  },
  {
    "provider": "Reveel",
    "platform_id": 1948
  },
  {
    "provider": "Revry",
    "platform_id": 473
  },
  {
    "provider": "Runtime",
    "platform_id": 1875
  },
  {
    "provider": "Screambox",
    "platform_id": 185
  },
  {
    "provider": "Screambox Amazon Channel",
    "platform_id": 202
  },
  {
    "provider": "ScreenPix Apple TV Channel",
    "platform_id": 2050
  },
  {
    "provider": "Shahid VIP",
    "platform_id": 1715
  },
  {
    "provider": "ShortsTV Amazon Channel",
    "platform_id": 688
  },
  {
    "provider": "Shout! Factory TV",
    "platform_id": 439
  },
  {
    "provider": "Showtime",
    "platform_id": 37
  },
  {
    "provider": "Showtime Amazon Channel",
    "platform_id": 203
  },
  {
    "provider": "Showtime Apple TV Channel",
    "platform_id": 675
  },
  {
    "provider": "Showtime Roku Premium Channel",
    "platform_id": 632
  },
  {
    "provider": "Shudder",
    "platform_id": 99
  },
  {
    "provider": "Shudder Amazon Channel",
    "platform_id": 204
  },
  {
    "provider": "Shudder Apple TV Channel",
    "platform_id": 2049
  },
  {
    "provider": "Smithsonian Channel",
    "platform_id": 276
  },
  {
    "provider": "Spamflix",
    "platform_id": 521
  },
  {
    "provider": "Spectrum On Demand",
    "platform_id": 486
  },
  {
    "provider": "Starz",
    "platform_id": 43
  },
  {
    "provider": "Starz Amazon Channel",
    "platform_id": 1794
  },
  {
    "provider": "Starz Apple TV Channel",
    "platform_id": 1855
  },
  {
    "provider": "Starz Roku Premium Channel",
    "platform_id": 634
  },
  {
    "provider": "Sun Nxt",
    "platform_id": 309
  },
  {
    "provider": "Sundance Now",
    "platform_id": 143
  },
  {
    "provider": "Takflix",
    "platform_id": 1771
  },
  {
    "provider": "TBS",
    "platform_id": 506
  },
  {
    "provider": "TCM",
    "platform_id": 361
  },
  {
    "provider": "The CW",
    "platform_id": 83
  },
  {
    "provider": "The Roku Channel",
    "platform_id": 207
  },
  {
    "provider": "TNT",
    "platform_id": 363
  },
  {
    "provider": "Topic",
    "platform_id": 454
  },
  {
    "provider": "Topic Apple TV Channel",
    "platform_id": 2046
  },
  {
    "provider": "Troma NOW",
    "platform_id": 2078
  },
  {
    "provider": "tru TV",
    "platform_id": 507
  },
  {
    "provider": "True Story",
    "platform_id": 567
  },
  {
    "provider": "Tubi TV",
    "platform_id": 73
  },
  {
    "provider": "Univer Video",
    "platform_id": 1860
  },
  {
    "provider": "UP Faith & Family Apple TV Channel",
    "platform_id": 2045
  },
  {
    "provider": "Urban Movie Channel",
    "platform_id": 251
  },
  {
    "provider": "USA Network",
    "platform_id": 322
  },
  {
    "provider": "Viaplay",
    "platform_id": 76
  },
  {
    "provider": "Viewster Amazon Channel",
    "platform_id": 295
  },
  {
    "provider": "VIX ",
    "platform_id": 457
  },
  {
    "provider": "Vudu",
    "platform_id": 7
  },
  {
    "provider": "VUDU Free",
    "platform_id": 332
  },
  {
    "provider": "WOW Presents Plus",
    "platform_id": 546
  },
  {
    "provider": "WWE Network",
    "platform_id": 260
  },
  {
    "provider": "Xumo Play",
    "platform_id": 1963
  },
  {
    "provider": "YouTube",
    "platform_id": 192
  },
  {
    "provider": "YouTube Free",
    "platform_id": 235
  },
  {
    "provider": "YouTube Premium",
    "platform_id": 188
  },
  {
    "provider": "Yupp TV",
    "platform_id": 255
  }
];

export const languages = ["English", "French"];