export default async (req, context) => {
    const url = new URL(req.url);
    if (url.searchParams.get("access_token") !== null) {
        // We have enough info, go back to the original URL
        // Go to sigpwny.com/admin and set the cookie nf_jwt to the access_token
        context.cookies.set({"name": "nf_jwt", "value": url.searchParams.get("access_token"), "sameSite": "none"})
        return Response.redirect("https://sigpwny.com/admin");
    }
    return;
};

export const config = {
  path: "/"
};