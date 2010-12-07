/**
 * Switch the link's href to an SSL-secured version if we have a 
 * matching rewrite rule. This check will happen on every page so
 * we can secure links to domains we handle from domains we don't.
 */
function handleClick(event) {
  if (event.target instanceof HTMLAnchorElement) {
    var redirectTo = safari.self.tab.canLoad(event, event.target.href);
    if (redirectTo) {
      event.target.href = redirectTo;
    }
  }
}

/**
 * Switch the form's action to an SSL-secured version if we have a 
 * matching rewrite rule. This check will happen on every page so
 * we can secure form submissions to domains we handle from domains 
 * we don't.
 */
function handleSubmit(event) {
  if (event.target instanceof HTMLFormElement) {
    var redirectTo = safari.self.tab.canLoad(event, event.target.action);
    if (redirectTo) {
      event.target.action = redirectTo;
    }
  }
}

document.addEventListener("click", handleClick, true);
document.addEventListener("submit", handleSubmit, true);
