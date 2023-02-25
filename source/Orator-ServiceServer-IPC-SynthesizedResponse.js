class OratorServiceServerIPCSynthesizedResponse
{
	constructor(pLog, pRequestGUID)
	{
		this.log = pLog;

		this.requestGUID = pRequestGUID;

		this.responseData = null;
		this.responseStatus = -1;
	}

	send(pData)
	{
		if (typeof(pData) == 'string')
		{
			// This is a string!  Append it to the responsedata.
			if (this.responseData === null)
			{
				this.responseData = pData;
				return true;
			}
			else if (typeof(this.responseData) == 'string')
			{
				this.responseData = this.responseData+pData;
				return true;
			}
			else
			{
				this.log(`Request ${this.requestGUID} has tried to send() a string value after send()ing data type ${typeof(this.responseData)}.`, pData)
				return false;
			}
		}
		else if (typeof(pData) == 'object')
		{
			if (this.responseData === null)
			{
				this.responseData = JSON.stringify(pData);
				return true;
			}
			else if (typeof(this.responseData) == 'string')
			{
				// TODO: Discuss best way to handle this / if to handle this
				this.responseData += this.responseData+JSON.stringify(pData);
				return true;
			}
			else
			{
				this.log(`Request ${this.requestGUID} has tried to send() an object value to be auto stringified after send()ing data type ${typeof(this.responseData)}.`, pData)
				return false;
			}
		}
	}
}

module.exports = OratorServiceServerIPCSynthesizedResponse;