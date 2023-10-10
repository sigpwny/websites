export default async (req, context) => {
    const url = new URL(req.url);
    // #access_token 
    if (url.hash.startsWith("#access_token")) {
        const access_token = new URL(req.url.replace("#", "?", 1)).searchParams.get("access_token")
        // We have enough info, go back to the original URL
        // Go to sigpwny.com/admin and set the cookie nf_jwt to the access_token
        context.cookies.set({name: "nf_jwt", value: access_token, "sameSite": "None"})
        return Response.redirect("https://sigpwny.com/admin");
    }
    return;
};

export const config = {
  path: "/"
};