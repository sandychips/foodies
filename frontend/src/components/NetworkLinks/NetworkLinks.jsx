import React from "react";
import sprite from "../../assets/img/sprite.svg";

const social = [
  {
    href: "https://www.facebook.com/goITclub/",
    iconId: "icon-facebook",
    label: "Facebook",
  },
  {
    href: " https://www.instagram.com/goitclub/",
    iconId: "icon-instagram",
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/c/GoIT ",
    iconId: "icon-youtube",
    label: "YouTube",
  },
];

const NetworkLinks = ({ className = "" }) => (
  <ul className={className}>
    {social.map(({ href, iconId, label }) => (
      <li key={iconId}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <svg aria-hidden="true">
            <use href={`${sprite}#${iconId}`} />
          </svg>
        </a>
      </li>
    ))}
  </ul>
);

export default NetworkLinks;
