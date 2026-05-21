const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ method: 'OPTIONS' });
    }

    try {
        // Vercel's serverless functions automatically parse JSON bodies, 
        // but we add a safety check here.
        const body = req.body;
        if (!body || !body.items) {
            return res.status(400).json({ 
                error: 'Invalid Request: No items found in cart. Please check your cart and try again.' 
            });
        }

        const items = body.items;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: item.name || 'Magical Item',
                        description: item.desc || 'Premium Streetwear',
                    },
                    unit_amount: (item.price || 0) * 100,
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: 'https://amagical-store.vercel.app/success',
            cancel_url: 'https://amagical-store.vercel.app/',
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ 
            error: 'Payment Gateway Error: ' + error.message 
        });
    }
};